import { atomWithStorage } from "jotai/utils";
import { IPartnerOnlyPatientInviteDTO } from "../api/models/interfaces/PartnerPatient.model";

export const invitingPartnerPatient = atomWithStorage<IPartnerOnlyPatientInviteDTO>("InvitePatientData", {});
