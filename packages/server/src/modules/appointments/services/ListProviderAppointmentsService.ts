import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface Request {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {};

  public async execute({ provider_id, day, month, year }: Request): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}-${year}-${month}-${day}`;

    // let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey);
    let appointments = null;

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year
      });

      await this.cacheProvider.save(cacheKey, classToClass(appointments))
    };

    return appointments;
  }
}

export default ListProviderAppointmentsService;