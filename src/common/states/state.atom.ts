import { atomWithStorage } from "jotai/utils";

// store selected state globally with persistence
export const selectedStateAtom = atomWithStorage<string | undefined>("selectedState", undefined);
