import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IClientDetails, IClientDto, IClientList, IClientLogoUpdateResponse, ILogoImageDto, IPartnerClientUpdateDTO } from "../models/interfaces/client.model";
import { ICommonParams } from "../models/interfaces/Common.model";
import { IStatusUpdateDTO } from "../models/interfaces/InviteDoctor.model";
import { IMedicineListItem, IPartnerMedicineListItem } from "../models/interfaces/Medication.model";
import { IPartnerClientDetails } from "../models/interfaces/PartnerClient.model";

class ClientRepository {
  constructor(private $http: AxiosInstance) {}

  addClient(payload: IClientDto) {
    return this.$http.post<IBaseResponse<null>>("clients", payload, { headers: { "Content-Type": "multipart/form-data" } });
  }

  getClients(params: any = null) {
    return this.$http.get<IBasePaginationResponse<IClientList[]>>("clients", { params: params, validateStatus: () => true });
  }

  getPaClients() {
    return this.$http.get<IBaseResponse<IClientList[]>>("physician/clients");
  }

  getClientDetails(clientId?: string) {
    return this.$http.get<IBaseResponse<IClientDetails>>(`clients/details?u_id=${clientId}`);
  }

  updateStatus(payload: IStatusUpdateDTO) {
    return this.$http.post<IBaseResponse<IClientList>>("client/status-update", payload);
  }

  clientLogoUpdate(payload: ILogoImageDto) {
    return this.$http.post<IBaseResponse<IClientLogoUpdateResponse>>(
      `client/logo-update/${payload.u_id}`,
      { logo: payload.logo },
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  }

  updateClientData(payload: IClientDetails, clientId?: string) {
    return this.$http.put<IBaseResponse<any>>(`clients/${clientId}`, payload);
  }

  assignClients(payload: IClientList) {
    return this.$http.post<IBaseResponse<null>>("doctor/clients-assign", payload);
  }

  // partner client api repo
  inviteClient(payload: any) {
    return this.$http.post<IBaseResponse<any>>("client/send-invite", payload);
  }
  getClientList(params?: ICommonParams) {
    return this.$http.get<IBasePaginationResponse<any[]>>("client/index", { params: params });
  }
  getClientPartnerDetails(slug: string | undefined | null) {
    return this.$http.get<IBaseResponse<any>>("customer/client/details", { params: { slug } });
  }
  getPublicPartnerClientDetails(slug: string | undefined | null) {
    return this.$http.get<IBaseResponse<IPartnerClientDetails>>("client/public-details", { params: { slug } });
  }
  clientPasswordSetUp(payload) {
    return this.$http.post<IBaseResponse<any>>("client/public-password-setup", payload);
  }
  clientResendLink(slug: string) {
    const payload = {
      slug,
    };
    return this.$http.post<IBaseResponse<any>>("client/resend-link", payload);
  }
  changeClientStatus(payload) {
    return this.$http.post<IBaseResponse<any>>("customer/client/status-update", payload);
  }

  getClientProductDetails(id: string, extraParams: any = {}) {
    const params = { ...extraParams, ...{ medication_id: id } };
    return this.$http.get<IBaseResponse<IMedicineListItem>>("client/customer/product/details", { params });
  }

  getCustomerAssignedProductDetails(id: string, extraParams: any = {}) {
    const params = { ...extraParams, ...{ medication_id: id } };
    return this.$http.get<IBaseResponse<IPartnerMedicineListItem>>("client/customer/product/details", { params });
  }

  updatePartnerClientBasicInfo(payload: IPartnerClientUpdateDTO) {
    return this.$http.post<IBaseResponse<any>>("customer/client/basic-information-update", payload);
  }
}

const addClientApiRepository = new ClientRepository($http);

export default addClientApiRepository;
