import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { FiClock, FiPower, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import 'react-day-picker/lib/style.css'

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar
} from './styles';

import logoImg from '../../assets/logo.svg';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
};

interface Appointment {
  id: string;
  date: string;
  formattedHour: string;
  user: {
    name: string;
    avatar_url: string;
  }
};

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    };
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1,
      }
    }).then(response => setMonthAvailability(response.data));
  }, [currentMonth, user.id]);

  useEffect(() => {
    api.get<Appointment[]>('/appointments/me', {
      params: {
        day: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear()
      }
    }).then(response => {
      const formattedAppointments = response.data.map(appointment => {
        return {
          ...appointment,
          formattedHour: format(parseISO(appointment.date), "HH:mm 'h'")
        }
      });

      setAppointments(formattedAppointments)
    });
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR })
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, "cccc'-feira'", { locale: ptBR })
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    })
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    })
  }, [appointments]);

  const nextAppointments = useMemo(() => {
    return appointments.find(appointment => isAfter(parseISO(appointment.date), new Date()))
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber"/>
        
          <Profile>
            {user.avatar_url ?
              <img src={user.avatar_url} alt={user.name}/> :
              <FiUser size={56} />
            }
            <div>
              <span>Bem-vindo</span>
              <Link to='/profile'><strong>{user.name}</strong></Link>
            </div>
          </Profile>

          <button type='button' onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointments &&
          <NextAppointment>
            <strong>Próximo agendamento</strong>
            <div>
              {nextAppointments.user.avatar_url ?
              <img src={nextAppointments.user.avatar_url} alt={nextAppointments.user.name} /> :
              <FiUser size={80} />
              }

              <strong>{nextAppointments.user.name}</strong>
              <span>
                <FiClock />
                {nextAppointments.formattedHour}
              </span>
            </div>
          </NextAppointment>
          }

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && <p>Não há nenhum agendamento neste período</p>}

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id} >
              <span>
                <FiClock />
                {appointment.formattedHour}
              </span>

              <div>
                {appointment.user.avatar_url ?
                <img src={appointment.user.avatar_url} alt={appointment.user.name} /> :
                <FiUser size={56} />
                }

                <strong>{appointment.user.name}</strong>
              </div>
            </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && <p>Não há nenhum agendamento neste período</p>}

            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id} >
              <span>
                <FiClock />
                {appointment.formattedHour}
              </span>

              <div>
                {appointment.user.avatar_url ?
                <img src={appointment.user.avatar_url} alt={appointment.user.name} /> :
                <FiUser size={56} />
                }

                <strong>{appointment.user.name}</strong>
              </div>
            </Appointment>
            ))}
          </Section>
        </Schedule>

        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{available: { daysOfWeek: [1, 2, 3, 4, 5] }}}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;