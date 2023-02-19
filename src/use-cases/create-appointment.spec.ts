import {describe, expect, it} from 'vitest'
import { Appointment } from '../entities/appointment';
import { CreateAppointment } from './create-appointment';
import {getFutureDate}from '../tests/utils/get-future-date'
import {InMemoryAppointmentsRepository} from '.././repositories/in-memory/in-memory-appoinments-repository'

describe("Create Appointment" , ()=> {
  it('should be able to create an appointment', async () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository()
    const sut = new CreateAppointment(appointmentsRepository);
    
    const startsAt = getFutureDate('2023-08-10');
    const endsAt = getFutureDate('2022-08-11');

    endsAt.setDate(endsAt.getDate()+1)

    expect(sut.execute({
      customer:"John Doe",
      endsAt,
      startsAt,
    })).resolves.toBeInstanceOf(Appointment)

  })

  it('should not be able to create an appointment with overlapping dates', async () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository()
    const sut = new CreateAppointment(appointmentsRepository);
    
    const startsAt = getFutureDate('2023-08-10');
    const endsAt = getFutureDate('2022-08-15');

    await sut.execute({
      customer:"John Doe",
      startsAt,
      endsAt,
    })


    expect(sut.execute({
      customer:"John Doe",
      startsAt:getFutureDate("2022-08-14"),
      endsAt:getFutureDate("2022-08-18"),
    })).rejects.toBeInstanceOf(Error);


  })
});