import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import addClientApiRepository from "@/common/api/repositories/clientRepositoiry";
import CustomFilter, { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import CustomSearchFilter from "@/common/components/SearchFilter";
import TableLoader from "@/common/components/TableLoader";
import dmlToast from "@/common/configs/toaster.config";
import { formatPhoneNumber } from "@/utils/helper.utils";
import { getStatusClassName, getStatusName } from "@/utils/status.utils";
import { Button, Paper, ScrollArea, Table, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InviteClient from "../components/InviteClient";

const ClientsPage = () => {
  const [client, setClient] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [openInviteClient, setOpenInviteClientHandler] = useDisclosure();

  useEffect(() => {
    setTotalPages(Math.ceil(+totalCount / +pageSize));
  }, [pageSize, totalCount]);

  const fetchClients = () => {
    const params: any = {
      page: pageIndex,
      per_page: pageSize,
      search: searchText || undefined,
      status: statusFilter,
    };

    return addClientApiRepository.getClientList(params);
  };

  const clientListQuery = useQuery({ queryKey: ["clinicList", pageIndex, pageSize, searchText, statusFilter], queryFn: () => fetchClients() });

  const clientQueryData = clientListQuery?.data?.data?.data?.data;

  useEffect(() => {
    setClient(clientQueryData || []);
    setTotalCount(clientListQuery?.data?.data?.data?.total || 0);
    setShowing({ from: clientListQuery?.data?.data?.data?.from || 0, to: clientListQuery?.data?.data?.data?.to || 0 });
  }, [clientListQuery]);

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
    // navigate("/admin-client/client");
  };

  const selectedFilter = statusFilter.length === 1 ? statusFilter[0] : "All Status";

  const handleInvitePharmacyClose = (reason) => {
    if (reason == "success") {
      clientListQuery.refetch();
    }
    setOpenInviteClientHandler.close();
  };

  const resendLinkMutation = useMutation({ mutationFn: (slug: string) => addClientApiRepository.clientResendLink(slug) });

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

  const rows = client.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>{item?.name}</Table.Td>
      <Table.Td>{formatPhoneNumber(item?.phone)}</Table.Td>
      <Table.Td className="truncate">{item?.email}</Table.Td>
      <Table.Td className="capitalize">{item?.customers_count ? item?.customers_count : "0"}</Table.Td>
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
              to={`${item.slug}/details`}
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
          <h6 className="lg:h2 md:h3 sm:h4">Client</h6>
        </div>
        <div className="page-title-end">
          <Button
            size="sm-2"
            onClick={() => setOpenInviteClientHandler.open()}
          >
            Add Client
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
      <Paper
        shadow="xs"
        radius={12}
      >
        <ScrollArea>
          <Table
            verticalSpacing="md"
            withRowBorders={false}
            layout="fixed"
            striped
            miw={900}
            stripedColor="background"
            highlightOnHover
            highlightOnHoverColor="primary.0"
            className="dml-list-table"
          >
            <Table.Thead className="border-b border-grey-low">
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Phone No.</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th className="text-nowrap">No. of Customers</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {clientListQuery?.isLoading ? (
                <TableLoader
                  rows={8}
                  columns={6}
                />
              ) : rows?.length > 0 ? (
                rows
              ) : (
                <NoTableData colSpan={6} />
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
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
      <InviteClient
        openModal={openInviteClient}
        onModalClose={(reason) => handleInvitePharmacyClose(reason)}
      />
    </>
  );
};

export default ClientsPage;
