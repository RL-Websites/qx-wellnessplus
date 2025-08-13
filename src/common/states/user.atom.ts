import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai/vanilla";
import { IUserData } from "../api/models/interfaces/User.model";
export const userAtom = atom<IUserData | null>(null);

export const asyncUserAtom = atom(async (get) => get(userAtom));

export const loginRedirectCountAtom = atomWithStorage<number>("loginRedirectCount", 0);
