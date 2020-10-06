import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(fakeAppointmentsRepository,fakeCacheProvider);
  })

  it("should be able to list the provider's appointments on a specific date", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 8).getTime();
    });

    const appointments1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'random-user-id',
      date: new Date(2020, 4, 20, 14, 0, 0)
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 8).getTime();
    });

    const appointments2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'random-user-id',
      date: new Date(2020, 4, 20, 15, 0, 0)
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      day: 20,
      month: 5,
      year: 2020
    });

    expect(appointments).toEqual([
      appointments1,
      appointments2
    ])
  });
});