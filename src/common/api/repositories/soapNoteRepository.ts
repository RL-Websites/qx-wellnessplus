import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IAddSoapNoteDTO } from "../models/interfaces/SoapNote.model";

class SoapNoteRepository {
  constructor(private $http: AxiosInstance) {}

  getSoapNoteData({ patientId, prescriptionId }: { patientId?: number; prescriptionId?: number }) {
    return this.$http.get<IBaseResponse<any>>("soap-note/index", { params: { patient_id: patientId, prescription_id: prescriptionId } });
  }

  addSoapNote(payload: IAddSoapNoteDTO) {
    return this.$http.post<IBaseResponse<any>>(`soap-note/add-update`, payload);
  }
}

const soapNoteApiRepository = new SoapNoteRepository($http);

export default soapNoteApiRepository;
