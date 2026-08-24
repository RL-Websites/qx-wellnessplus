import { checkoutKeyAtom } from "@/common/states/product.atom";
import { useAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";

const CHECKOUT_KEY_STORAGE = "qxCheckoutKey";

/**
 * Reads the stored key without going through the atom.
 *
 * Belt and braces against the failure this caused once already: if the atom has not
 * yet reflected localStorage for any reason, minting a replacement silently orphans
 * every lab report already staged under the previous key. Never mint while a stored
 * key exists.
 */
const readStoredCheckoutKey = (): string | undefined => {
  try {
    const raw = localStorage.getItem(CHECKOUT_KEY_STORAGE);
    if (!raw) return undefined;
    // atomWithStorage persists JSON, so the stored value is a quoted string.
    const parsed = JSON.parse(raw);
    return typeof parsed === "string" && parsed ? parsed : undefined;
  } catch {
    return undefined;
  }
};

/**
 * The current checkout attempt's key, created on first use.
 *
 * Kept out of the atom's default so a key is only minted when something actually
 * needs one (a lab upload), rather than for every visitor who loads the site.
 */
export default function useCheckoutKey() {
  const [checkoutKey, setCheckoutKey] = useAtom(checkoutKeyAtom);

  const ensureCheckoutKey = () => {
    const existing = checkoutKey ?? readStoredCheckoutKey();

    if (existing) {
      // Re-sync the atom if it drifted from storage, but keep the same key.
      if (existing !== checkoutKey) setCheckoutKey(existing);
      return existing;
    }

    const nextKey = uuidv4();
    setCheckoutKey(nextKey);
    return nextKey;
  };

  const clearCheckoutKey = () => setCheckoutKey(undefined);

  return { checkoutKey: checkoutKey ?? readStoredCheckoutKey(), ensureCheckoutKey, clearCheckoutKey };
}
