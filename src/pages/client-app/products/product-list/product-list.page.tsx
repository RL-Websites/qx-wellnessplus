import { IMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import CustomFilter, { IShowing } from "@/common/components/CustomFilter";
import NoData from "@/common/components/NoData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import CustomSearchFilter from "@/common/components/SearchFilter";
import { Button, ScrollArea, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ProductCard from "../../../../common/components/client/product/product.card";

function ProductPageList() {
  const [medicines, setMedicines] = useState<IMedicineListItem[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [searchText, setSearchText] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string[]>(["1", "0"]);

  const fetchMedicine = () => {
    const params = {
      per_page: pageSize,
      page: pageIndex,
      search: searchText,
      status: statusFilter,
    };
    return partnerApiRepository.getAllMedicines(params);
  };

  const useMedicineQuery = useQuery({ queryKey: ["MedicineList", pageSize, pageIndex, statusFilter, searchText], queryFn: fetchMedicine });

  useEffect(() => {
    if (useMedicineQuery?.data?.status == 200 && useMedicineQuery?.data?.data?.data) {
      if ("data" in useMedicineQuery.data.data.data && "total" in useMedicineQuery.data.data.data) {
        setMedicines(useMedicineQuery.data?.data?.data?.data || []);
        setTotalCount(useMedicineQuery.data?.data?.data?.total || 0);
        setShowing({ from: useMedicineQuery.data?.data?.data?.from || 0, to: useMedicineQuery.data?.data?.data?.to || 0 });
      }
    }
  }, [useMedicineQuery.isFetched, useMedicineQuery.data]);

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };
  const handleFilterChange = (filter) => {
    if (filter == "") {
      setStatusFilter([]);
    } else {
      setStatusFilter([filter]);
    }
    setPageIndex(1);
  };

  const formatDrugStrength = (value?: string): string => {
    if (!value) return "";
    return value.startsWith(".") ? `0${value}` : value;
  };

  return (
    <>
      <div className="page-title pb-5">
        <div className="page-title-start">
          <h6 className="lg:h2 md:h3 sm:h4">Medications</h6>
        </div>
        <div className="page-title-end flex-wrap">
          <Button
            size="sm-2"
            component={NavLink}
            to={`/client/products/add-product`}
          >
            Add Medication
          </Button>
          <CustomSearchFilter
            onSearch={(text) => {
              setSearchText(text);
              setPageIndex(1);
            }}
          />
          <CustomFilter
            currentPage={pageIndex}
            filterParams={[
              {
                label: "All Status",
                key: "",
                iconClass: "icon-all_source",
              },
              {
                label: "Active",
                key: "1",
                iconClass: "icon-available",
              },
              {
                label: "Inactive",
                key: "0",
                iconClass: "icon-deactive",
              },
            ]}
            selectedFilter={""}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
      <div className="card">
        {useMedicineQuery?.isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton
              height={198}
              className="rounded-xl"
            />
            <Skeleton
              height={198}
              className="rounded-xl"
            />
            <Skeleton
              height={198}
              className="rounded-xl"
            />
            <Skeleton
              height={198}
              className="rounded-xl"
            />
          </div>
        ) : medicines?.length ? (
          <ScrollArea
            type="hover"
            scrollbarSize={6}
            styles={{
              root: { minHeight: "270px" },
            }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {medicines?.map((medicine) => (
                <ProductCard
                  key={medicine.id}
                  medicine={medicine}
                  module="client"
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex h-[400px] items-center justify-center">
            <NoData
              imgClass="w-[200px] lg:w-[300px] m-0 mb-4"
              titleClass="h6 text-foreground mb-2"
              title="No products available yet!"
            />
          </div>
        )}

        <div className="flex justify-end mt-5 mb-2 me-4">
          <PaginationFilter
            pageSize={pageSize}
            currentPage={pageIndex}
            totalCount={totalCount}
            showing={showing}
            updateCurrentPage={updateCurrentPage}
            updatePageSize={updatePageSize}
          />
        </div>
      </div>
    </>
  );
}

export default ProductPageList;
