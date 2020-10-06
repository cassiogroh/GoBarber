import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(fakeAppointmentsRepository);
  })

  it("should be able to list provider's month availability", async () => {
    for (let hour = 8; hour < 18; hour++) {
      await fakeAppointmentsRepository.create({
        provider_id: 'random-user',
        user_id: 'random-user-id',
        date: new Date(2020, 4, 20, hour, 0, 0)
      });
    }

    await fakeAppointmentsRepository.create({
      provider_id: 'random-user',
      user_id: 'random-user-id',
      date: new Date(2020, 4, 21, 8, 0, 0)
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'random-user',
      year: 2020,
      month: 5
    });

    expect(availability).toEqual(expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ])
    )
  });
});