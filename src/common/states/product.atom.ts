import { IMedicineListItem, IPrevGlpMedDetails } from "@/common/api/models/interfaces/Medication.model";
import { atomWithStorage } from "jotai/utils";

export const cartItemsAtom = atomWithStorage<IMedicineListItem[]>("cartItems", [], undefined, { getOnInit: true });

export const prevGlpMedDetails = atomWithStorage<IPrevGlpMedDetails | undefined>("prevGlpDetails", undefined);

/**
 * Identifies one checkout attempt.
 *
 * QX uploads lab reports before the order exists, so the backend stores them with no
 * prescription and claims them at patient-data-fill-up. This key is what makes that
 * claim unambiguous — without it, a report left behind by an abandoned checkout
 * could be swept into an unrelated later order for the same patient.
 *
 * Generated lazily by `useCheckoutKey`, and cleared with the cart once the order is
 * placed so the next checkout starts a fresh one.
 *
 * `getOnInit` is load-bearing, exactly as it is for the cart above. Without it the
 * first read of every mount returns the default instead of the stored value, so the
 * key-minting effect saw "no key" on each page and issued a new one — orphaning the
 * report already staged under the previous key.
 */
export const checkoutKeyAtom = atomWithStorage<string | undefined>("qxCheckoutKey", undefined, undefined, { getOnInit: true });
