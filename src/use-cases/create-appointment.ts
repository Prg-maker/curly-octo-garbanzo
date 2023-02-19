import {Appointment} from '../entities/appointment'
import { AppointmentsRepository } from '../repositories/appoinments-repositories';

interface CreateAppointmentRequest {
  customer: string;
  startsAt: Date;
  endsAt:Date;
}

type CreateAppointmentResponse = Appointment;

export class CreateAppointment{

  constructor(
    private appointmentsRepository: AppointmentsRepository
  ){

  }

  async execute({customer , endsAt , startsAt}:CreateAppointmentRequest ):Promise<CreateAppointmentResponse>{

    const overlappingAppointment= await this.appointmentsRepository.findOverlappingAppointment(
      startsAt,
      endsAt
    )

    if(overlappingAppointment){
      throw new Error ("Another Appointment overlaps this appointments datas ")
    }

    const appointment = new Appointment({
      customer,
      endsAt,
      startsAt
    });

    await this.appointmentsRepository.create(appointment)

    return appointment

    
    
  }
}