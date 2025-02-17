import React, { useRef, useCallback } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import imagePicker from 'react-native-image-picker';

import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
};

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleUpdateUser = useCallback(async (data: ProfileFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string()
          .required('Nome obrigatório'),
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().min(6, 'Mínimo 6 dígitos').required('Campo obrigatório'),
          otherwise: Yup.string()
        }),
        password_confirmation: Yup.string()
        .when('old_password', {
          is: val => !!val.length,
          then: Yup.string().min(6, 'Mínimo 6 dígitos').required('Campo obrigatório'),
          otherwise: Yup.string()
        })
        .oneOf([Yup.ref('password')], 'Confirmação incorreta')
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const { name, email, old_password, password, password_confirmation } = data;

      const formData = {
        name,
        email,
        ...(old_password
        ? {
            old_password,
            password,
            password_confirmation
          }
        : {})
      };

      const response = await api.put('/profile', formData);

      updateUser(response.data);

      Alert.alert('Perfil atualizado com sucesso!',);

      navigation.goBack();

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert(
        'Erro na atualização do perfil',
        'Ocorreu um erro ao atualizar seu perfil. Tente novamente.'
      );
    }
  }, [navigation, updateUser]);

  const handleUpdateAvatar = useCallback(() => {
    imagePicker.showImagePicker({
      title: 'Selecione uma foto',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Usar câmera',
      chooseFromLibraryButtonTitle: 'Escolher da galeria'
    }, response => {
      if (response.didCancel) {
        return;
      };

      if (response.error) {
        Alert.alert('Erro ao atualizar sua foto de perfil');
        return;
      };

      const data = new FormData();

      data.append('avatar', {
        type: 'image/jpeg',
        name: `${user.id}.jpg`,
        uri: response.uri
      });

      api.patch('/users/avatar', data).then(apiResponse => {
        updateUser(apiResponse.data);
      }).catch(console.log)
    });
  }, [updateUser, user.id]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={Platform.OS === 'ios' && { flex: 1 }}
      >
        <Container>
          <BackButton onPress={handleGoBack}>
            <Icon name='chevron-left' size={24} color='#999591' />
          </BackButton>   

          <UserAvatarButton onPress={handleUpdateAvatar}>
            <UserAvatar source={{ uri: user.avatar_url }} />
          </UserAvatarButton>

          <Title>Meu perfil</Title>

          <Form initialData={user} ref={formRef} onSubmit={handleUpdateUser}>
            <Input
              autoCapitalize='words'
              name='name'
              icon='user'
              placeholder='Nome'
              returnKeyType='next'
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
            />

            <Input
              ref={emailInputRef}
              keyboardType='email-address'
              autoCorrect={false}
              autoCapitalize='none'
              name='email'
              icon='mail'
              placeholder='E-mail'
              returnKeyType='next'
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />

            <Input
              ref={oldPasswordInputRef}
              secureTextEntry
              textContentType='newPassword'
              name='old_password'
              icon='lock'
              placeholder='Senha atual'
              returnKeyType='next'
              containerStyle={{ marginTop: 16 }}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />

            <Input
              ref={passwordInputRef}
              secureTextEntry
              textContentType='newPassword'
              name='password'
              icon='lock'
              placeholder='Nova senha'
              returnKeyType='next'
              onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            />

            <Input
              ref={confirmPasswordInputRef}
              secureTextEntry
              textContentType='newPassword'
              name='password_confirmation'
              icon='lock'
              placeholder='Confirmar senha'
              returnKeyType='send'
              onSubmitEditing={() => formRef.current?.submitForm()}
            />
          </Form>

          <Button onPress={() => formRef.current?.submitForm()}>
            Confirmar mudanças
          </Button>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Profile;