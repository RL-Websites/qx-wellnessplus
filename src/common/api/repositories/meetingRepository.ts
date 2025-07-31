import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { Meeting } from "../models/interfaces/MeetingInformation";

class MeetingRepository {
  constructor(private $http: AxiosInstance) {}

  getMeetingDetails(params: { channelName?: string | undefined; doctorUId?: string | null }) {
    return this.$http.get<IBaseResponse<Meeting>>("agora/meeting-link-information", { params: params });
  }
}

const meetingRepository = new MeetingRepository($http);
export default meetingRepository;
