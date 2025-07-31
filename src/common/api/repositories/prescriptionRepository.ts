import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IManageStatusDTO } from "../models/interfaces/Patient.model";
import { IIntakeFormData, IMessageDetails, IPrescriptionDetails, IServicePrescription, patientRequestList } from "../models/interfaces/Prescription.model";

class PrescriptionRepository {
  constructor(private $http: AxiosInstance) {}

  getPrescriptions(params: any = null) {
    return this.$http.get<IBasePaginationResponse<patientRequestList[]>>("prescriptions", { params: params });
  }

  getSericePrescriptions(params: any = null) {
    return this.$http.get<IBasePaginationResponse<IServicePrescription[]>>("service-prescriptions", { params: params });
  }

  getClinicPrescriptions(params: any = null) {
    return this.$http.get<IBasePaginationResponse<patientRequestList[]>>("clinics/all-prescriptions", { params: params });
  }

  getPrescriberPrescriptions(params: any = null) {
    return this.$http.get<IBasePaginationResponse<patientRequestList[]>>("clinic-prescriber/prescriptions", { params: params });
  }

  getPaPrescriptions(params: any) {
    return this.$http.get<IBasePaginationResponse<patientRequestList[]>>("physician/prescription/pending-patients", { params: params });
  }

  managePrescriptionStatus({ id, ...payload }: IManageStatusDTO) {
    return this.$http.post<IBaseResponse<any>>(`prescriptions/manage-status/${id}`, payload);
  }

  createPrescription(payload: any) {
    return this.$http.post<IBaseResponse<any>>(`prescriptions/create-prescription`, payload);
  }

  dosespotInforCheck(payload: any) {
    return this.$http.post<IBaseResponse<any>>(`prescriptions/check-dosecpot-info`, payload);
  }

  dosespotCheckAndCreate(payload: any) {
    return this.$http.post<IBaseResponse<any>>(`clinic-prescription/dosespot-check-and-create`, payload);
  }

  managePaPrescriptionStatus({ id, ...payload }: IManageStatusDTO) {
    return this.$http.post<IBaseResponse<any>>(`physician/prescription/manage-status/${id}`, payload);
  }

  getPrescriptionDetails(id: string) {
    return this.$http.get<IBaseResponse<IPrescriptionDetails>>(`prescriptions/details/${id}`);
  }

  getServicePrescriptionDetails(id: string) {
    return this.$http.get<IBaseResponse<IServicePrescription>>(`service-prescriptions/details/${id}`);
  }

  messageDetails(id: string, params: any) {
    return this.$http.get<IBaseResponse<IMessageDetails>>(`/messages/details/${id}`, { params: params });
  }

  getIntakeFormData({ patientId, prescriptionId }: { patientId: string; prescriptionId: string }) {
    return this.$http.get<IBaseResponse<IIntakeFormData>>(`soap-note/intake-form/${patientId}/${prescriptionId}`);
  }

  getIntakeFormPdf({ patientId, prescriptionId }: { patientId: string; prescriptionId: string }) {
    return this.$http.get<IBaseResponse<any>>(`download/intake-form-pdf/${patientId}/${prescriptionId}`);
  }
}

const prescriptionApiRepository = new PrescriptionRepository($http);

export default prescriptionApiRepository;
