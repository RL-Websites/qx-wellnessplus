import { atomWithStorage } from "jotai/utils";

export const selectedCategoryAtom = atomWithStorage<string | undefined>("selectedCategory", undefined);
