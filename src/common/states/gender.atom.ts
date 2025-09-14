import { atomWithStorage } from "jotai/utils";

export const selectedGenderAtom = atomWithStorage<string>("selectedGender", "");
