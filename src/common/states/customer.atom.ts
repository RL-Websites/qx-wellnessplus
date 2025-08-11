import { atomWithStorage } from "jotai/utils";
import { IQXCustomerDetails } from "../api/models/interfaces/Customer.model";

export const customerAtom = atomWithStorage<IQXCustomerDetails | undefined>("customerData", undefined);
