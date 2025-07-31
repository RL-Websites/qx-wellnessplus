import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IDocumentRenameDTO } from "../models/interfaces/Document.model";

class DocumentRepository {
  constructor(private $http: AxiosInstance) {}

  documentRemove(document_id: string) {
    return this.$http.post<IBaseResponse<any>>("upload-documents-remove", { document_id: document_id });
  }
  documentRename(payload: IDocumentRenameDTO) {
    return this.$http.post<IBaseResponse<any>>("upload-documents-rename", payload);
  }

  // profileImageUpdate(payload: IProfileImageDto) {
  //   return this.$http.post<IBaseResponse<IProfileImageUpdateResponse>>("/user/profile-image-update", payload, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });
  // }
}

const documentRepository = new DocumentRepository($http);

export default documentRepository;
