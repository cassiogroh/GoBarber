import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Alert, Platform } from 'react-native';
import { format } from 'date-fns';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import { Provider } from '../Dashboard';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderAvatar,
  ProviderContainer,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Hour,
  HourText,
  Schedule,
  Section,
  SectionContent,
  SectionTitle,
  CreateAppointmentButton,
  CreateAppointmentButtonText
} from './styles';

interface RouteParams {
  providerId: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { goBack, navigate } = useNavigation();
  const { user } = useAuth();

  const { providerId } = route.params as RouteParams;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId);
  const [selectedHour, setSelectedHour] = useState(0);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);

  useEffect(() => {
    api.get('/providers').then(response => {
      setProviders(response.data);
    }).catch(console.log);
  }, []);

  useEffect(() => {
    api.get(`/providers/${selectedProvider}/day-availability`, {
      params: {
        day: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear()
      }
    }).then(response => setAvailability(response.data))
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, []);

  const handleSelectProvider = useCallback((provider_id: string) => {
    setSelectedProvider(provider_id);
  }, []);

  const handleOpenDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChanged = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') setShowDatePicker(false);

    if (date) setSelectedDate(date);
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const morningAvailabilty = useMemo(() => {
    return availability
    .filter(({ hour }) => hour < 12)
    .map(({ hour, available }) => {
      return {
        hour,
        available,
        formattedHour: format(new Date().setHours(hour), 'HH:00')
      }
    })
  }, [availability]);

  const afternoonAvailabilty = useMemo(() => {
    return availability
    .filter(({ hour }) => hour >= 12)
    .map(({ hour, available }) => {
      return {
        hour,
        available,
        formattedHour: format(new Date().setHours(hour), 'HH:00')
      }
    })
  }, [availability]);

  const handleCreateAppointment = useCallback( async () => {
    try{
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('/appointments', {
        provider_id: selectedProvider,
        date
      });

      navigate('AppointmentCreated', { date: date.getTime() })
    } catch (err) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar um agendamento, tente novamente.'
      )
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name='chevron-left' size={24} color='#999591' />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProvider}
                onPress={() => handleSelectProvider(provider.id)}
              >
                {provider.avatar_url ?
                <ProviderAvatar source={{ uri: provider.avatar_url }} /> :
                <Icon name='user' size={32} color='#F4EDE8'/>
                }
                <ProviderName selected={provider.id === selectedProvider}>{provider.name}</ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleOpenDatePicker}>
              <OpenDatePickerButtonText>Selecionar outra data</OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker &&
            <DateTimePicker
              mode='date'
              display='calendar'
              value={selectedDate}
              onChange={handleDateChanged}
            />
          }
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailabilty.map(({ formattedHour, hour, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  onPress={() => handleSelectHour(hour)}
                  available={available}
                  key={formattedHour}
                >
                  <HourText selected={selectedHour === hour}>{formattedHour}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailabilty.map(({ formattedHour, hour, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  onPress={() => handleSelectHour(hour)}
                  available={available}
                  key={formattedHour}
                >
                  <HourText selected={selectedHour === hour}>{formattedHour}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  )
};

export default CreateAppointment;