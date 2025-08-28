export interface ICommonParams {
  search?: string;
  page?: number;
  per_page?: number;
  sort_column?: string;
  sort_direction?: "asc" | "desc" | string | undefined;
  status?: string[] | undefined;
  with_schedule?: boolean;
  medication_id?: string;
  customer_slug?: string;
  noPaginate?: boolean;
  category?: string[];
}

export interface IGetAssignedPartnerParams extends ICommonParams {
  medication_id?: string;
}

export interface IGetPriceHistoryParams extends ICommonParams {
  customer_id?: string;
}

export interface IGetMedicationListParams extends ICommonParams {
  lastDoseDate?: Date;
  lastDose?: string;
  currentMedType?: string;
  preferredMedType?: string;
}
