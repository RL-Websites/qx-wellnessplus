import { atomWithStorage } from "jotai/utils";

export interface IBasicInfo {
  patient: IPatient;
}

export interface IPatient {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
}

export const basicInfoAtom = atomWithStorage<IBasicInfo | undefined>("basicInfoData", undefined);
