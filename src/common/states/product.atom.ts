import { IMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { atomWithStorage } from "jotai/utils";

export const cartItemsAtom = atomWithStorage<IMedicineListItem[]>("cartItems", []);
