import { useQuery } from "@tanstack/react-query";
import { medicineRepository } from "../repositories/medicineRepository";

export const useMedicineDetails = (id: string) => {
  const { data, isFetched, isFetching } = useQuery({
    queryKey: ["medicineEditQuery", id],
    queryFn: () => medicineRepository.getMedicineDetails(id),
    enabled: !!id,
  });

  return {
    data: data?.data,
    isFetched,
    isFetching,
  };
};
