import { IMedicineListItem, IPrevGlpMedDetails } from "@/common/api/models/interfaces/Medication.model";
import { atomWithStorage } from "jotai/utils";

export const cartItemsAtom = atomWithStorage<IMedicineListItem[]>("cartItems", [], undefined, { getOnInit: true });

export const prevGlpMedDetails = atomWithStorage<IPrevGlpMedDetails | undefined>("prevGlpDetails", undefined);
