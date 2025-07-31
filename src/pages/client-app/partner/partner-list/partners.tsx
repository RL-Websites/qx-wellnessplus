import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { ICommonParams } from "@/common/api/models/interfaces/Common.model";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import CustomFilter, { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import CustomSearchFilter from "@/common/components/SearchFilter";
import TableLoader from "@/common/components/TableLoader";
import dmlToast from "@/common/configs/toaster.config";
import { formatPhoneNumber } from "@/utils/helper.utils";
import { getStatusClassName, getStatusName } from "@/utils/status.utils";
import { Button, ScrollAreaAutosize, Table, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddPartnerAccount from "../../common/AddPartnerAccount";

const PartnerList = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [partnerList, setPartnerList] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [openAddPartnerModal, addPartnerModalHandler] = useDisclosure();

  const navigate = useNavigate();

  useEffect(() => {
    setTotalPages(Math.ceil(+totalCount / +pageSize));
  }, [pageSize, totalCount]);

  const fetchPharmacies = () => {
    const params: ICommonParams = {
      page: pageIndex,
      per_page: pageSize,
      status: statusFilter,
      search: searchText || undefined,
    };

    return partnerApiRepository.getPartnerList(params);
  };

  const partnerListQuery = useQuery({ queryKey: ["partnerList", pageIndex, pageSize, statusFilter, searchText], queryFn: () => fetchPharmacies() });
  const partnerQueryData = partnerListQuery?.data?.data?.data?.data;

  useEffect(() => {
    setPartnerList(partnerListQuery?.data?.data?.data?.data || []);
    setTotalCount(partnerListQuery?.data?.data?.data?.total || 0);
    setShowing({ from: partnerListQuery?.data?.data?.data?.from || 0, to: partnerListQuery?.data?.data?.data?.to || 0 });
  }, [partnerListQuery.isFetched, partnerQueryData]);

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const resendLinkMutation = useMutation({ mutationFn: (slug: string) => partnerApiRepository.partnerResendLink(slug) });

  const handleResendLink = (slug?: string) => {
    if (slug) {
      resendLinkMutation.mutate(slug, {
        onSuccess: (res) => {
          dmlToast.success({
            title: res?.data?.message,
          });
        },
        onError: (error) => {
          const err = error as AxiosError<IServerErrorResponse>;
          console.log(err?.response?.data?.message);
          dmlToast.error({
            title: err?.response?.data?.message,
          });
        },
      });
    } else {
      dmlToast.error({
        title: "Client ID missing, please try again later.",
      });
    }
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
    navigate("/client/partner-accounts");
  };

  const selectedFilter = statusFilter.length === 1 ? statusFilter[0] : "All Status";

  const addPartnerModalClose = (reason) => {
    if (reason == "success") {
      partnerListQuery?.refetch();
    }
    addPartnerModalHandler.close();
  };

  const rows = partnerList?.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageIndex - 1) * pageSize + index + 1}</Table.Td>
      <Table.Td>{item?.account_name}</Table.Td>
      <Table.Td>{formatPhoneNumber(item?.phone)}</Table.Td>
      <Table.Td className="break-all">{item?.email}</Table.Td>
      <Table.Td className="truncate">{item?.address || ""}</Table.Td>
      <Table.Td className="truncate capitalize">{item?.payment_type || ""}</Table.Td>
      <Table.Td>{item?.status ? <span className={`tags capitalize ${getStatusClassName(item?.status)}`}>{getStatusName(item?.status)}</span> : ""}</Table.Td>
      <Table.Td>
        {item.status == "invited" || item.status == "pending" ? (
          <Button
            variant="light"
            size="xs"
            fs="xs"
            onClick={() => handleResendLink(item?.slug)}
            loading={resendLinkMutation.isPending && resendLinkMutation.variables == item?.slug}
          >
            Resend Link
          </Button>
        ) : (
          <Tooltip
            label="View Details"
            position="top"
            offset={{ mainAxis: 15 }}
          >
            <Link
              to={`${item?.slug}/details`}
              className="text-fs-sm text-primary mt-1 inline-block"
            >
              <i className="icon-Through text-2xl/none"></i>
            </Link>
          </Tooltip>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <div className="page-title flex-wrap pb-5">
        <div className="page-title-start">
          <h6 className="lg:h2 md:h3 sm:h4">Customer Account</h6>
        </div>
        <div className="page-title-end">
          <Button
            size="sm-2"
            onClick={addPartnerModalHandler.open}
          >
            Add Customer Account
          </Button>
          <CustomSearchFilter onSearch={setSearchText} />
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
                key: "active",
                iconClass: "icon-available",
              },
              {
                label: "Inactive",
                key: "inactive",
                iconClass: "icon-deactive",
              },
              {
                label: "Pending",
                key: "pending",
                iconClass: "icon-in_queue",
              },
              {
                label: "Invited",
                key: "invited",
                iconClass: "icon-in_queue",
              },
            ]}
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
      <div className="card p-0">
        <ScrollAreaAutosize>
          <Table
            verticalSpacing="md"
            withRowBorders={false}
            miw={1200}
            layout="fixed"
            striped
            stripedColor="background"
            highlightOnHover
            highlightOnHoverColor="primary.0"
            className="dml-list-table"
          >
            <Table.Thead className="border-b border-grey-low">
              <Table.Tr>
                <Table.Th className="w-[70px]">ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Phone No.</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Address</Table.Th>
                <Table.Th>Payment Type</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th className="w-[150px]">Action</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {partnerListQuery?.isLoading ? (
                <TableLoader
                  rows={8}
                  columns={8}
                />
              ) : rows?.length > 0 ? (
                rows
              ) : (
                <NoTableData colSpan={8} />
              )}
            </Table.Tbody>
          </Table>
        </ScrollAreaAutosize>
      </div>
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

      <AddPartnerAccount
        onModalClose={(reason) => addPartnerModalClose(reason)}
        openModal={openAddPartnerModal}
      />
    </>
  );
};

export default PartnerList;
