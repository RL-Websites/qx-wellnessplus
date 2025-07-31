import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IAppointMentCreateDTO, IAppointmentScheduleData, IConfirmAppointmentDTO, IDocAptSchedule, ISchedulesRefData } from "../models/interfaces/Appointment.model";
import { ISchedule, IScheduleDTO, ISetPrescriberScheduleDTO, ISlot } from "../models/interfaces/Schedule.model";

class ScheduleApiRepository {
  constructor(private $http: AxiosInstance) {}

  getSchedule(doctorId: string = "") {
    return this.$http.get<IBaseResponse<ISchedule>>(`doctor/get-schedules`, { params: { doctorId: doctorId } });
  }

  getPaSchedule() {
    return this.$http.get<IBaseResponse<ISchedule>>(`physician/get-schedules`);
  }

  setSchedule(payload: IScheduleDTO) {
    return this.$http.post<IBaseResponse<any>>("doctor/set-schedule", payload);
  }

  setPrescriberSchedule(payload: ISetPrescriberScheduleDTO) {
    return this.$http.post<IBaseResponse<any>>("spa/prescriber/set-schedule", payload);
  }

  setPaSchedule(payload: IScheduleDTO) {
    return this.$http.post<IBaseResponse<any>>("physician/set-schedule", payload);
  }

  getSlotList() {
    return this.$http.get<IBaseResponse<ISlot[]>>("slots");
  }

  // apointment methods
  makeAppointment(payload: IAppointMentCreateDTO) {
    return this.$http.post<IBaseResponse<any>>("appointment/create", payload);
  }

  getAppointmentScheduleDetails(prescription_u_id: string) {
    return this.$http.get<IBaseResponse<IAppointmentScheduleData>>("appointment-schedule", { params: { prescription_u_id } });
  }

  getPaAppointmentScheduleDetails(prescription_u_id: string) {
    return this.$http.get<IBaseResponse<IAppointmentScheduleData>>("physician/appointment-schedule", { params: { prescription_u_id } });
  }

  confirmAppointmentSchedule(payload: IConfirmAppointmentDTO) {
    return this.$http.post<IBaseResponse<any>>("confirm-appointment-schedule", payload);
  }

  confirmAppointmentSchedulePa(payload: IConfirmAppointmentDTO) {
    return this.$http.post<IBaseResponse<any>>("physician/confirm-appointment-schedule", payload);
  }

  getDoctorAppointmentSchedules() {
    return this.$http.get<IBaseResponse<IDocAptSchedule[]>>("appointment/list");
  }

  getSpaPrescriberSchedule() {
    return this.$http.get<IBaseResponse<ISchedule>>(`spa/prescriber/get-schedule`);
  }

  getDocuSpaSchedules(docu_spa_id: string) {
    return this.$http.get<IBaseResponse<ISchedulesRefData>>(`get-docu-spa-schedules`, { params: { docu_spa_id: docu_spa_id } });
  }
}

const scheduleApiRepository = new ScheduleApiRepository($http);

export default scheduleApiRepository;
