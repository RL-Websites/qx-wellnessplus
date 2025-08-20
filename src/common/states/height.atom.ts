import { atomWithStorage } from "jotai/utils";

export interface IHeightFeet {
  height_feet: number;
  height_inch: number;
}

export const heightAtom = atomWithStorage<IHeightFeet | undefined>("height", undefined);

export const weightAtom = atomWithStorage<string>("weight", "");
