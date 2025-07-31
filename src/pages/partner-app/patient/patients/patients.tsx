import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import CustomFilter, { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import CustomSearchFilter from "@/common/components/SearchFilter";
import TableLoader from "@/common/components/TableLoader";
import { formatPhoneNumber } from "@/utils/helper.utils";
import { Button, Paper, ScrollArea, Table, Tooltip } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, NavLink as RdNavLink, useNavigate, useSearchParams } from "react-router-dom";

const Patients = () => {
  const [patients, setPatients] = useState<any[]>([]);

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [searchText, setSearchText] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string[]>(["pending", "invited"]);

  const navigate = useNavigate();

  const [queryParams] = useSearchParams();

  useEffect(() => {
    const status = queryParams.get("status");
    if (status !== undefined && status != "" && status != null) {
      setStatusFilter([status]);
    }
  }, [queryParams]);

  useEffect(() => {
    setTotalPages(Math.ceil(+totalCount / +pageSize));
  }, [pageSize, totalCount]);

  const fetchPatients = () => {
    const params = {
      per_page: pageSize,
      sort_column: "created_at",
      sort_direction: "desc",
      page: pageIndex,
      status: statusFilter,
      search: searchText,
    };
    return partnerApiRepository.getAllPatients(params);
  };
  const patientQuery = useQuery({ queryKey: ["patients", pageSize, pageIndex, statusFilter, searchText], queryFn: fetchPatients });

  useEffect(() => {
    if (patientQuery.isFetched) {
      if (patientQuery?.data?.status == 200) {
        setPatients(patientQuery.data?.data?.data?.data || []);
        setTotalCount(patientQuery.data?.data?.data?.total || 0);
        setShowing({ from: patientQuery.data?.data?.data?.from || 0, to: patientQuery.data?.data?.data?.to || 0 });
      }
    }
  }, [patientQuery.isFetched, patientQuery.isRefetching, patientQuery.data]);

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const handleFilterChange = (filter) => {
    if (filter == "") {
      setStatusFilter(["pending", "invited"]);
    } else {
      setStatusFilter([filter]);
    }
    setPageIndex(1);
    navigate("/partner/patients");
  };

  const selectedFilter = statusFilter.length === 1 ? statusFilter[0] : "All Status";

  const rows = patients.map((element, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageIndex - 1) * pageSize + index + 1}</Table.Td>
      <Table.Td>{element?.name}</Table.Td>
      <Table.Td>{element?.cell_phone ? formatPhoneNumber(element?.cell_phone) : ""}</Table.Td>
      <Table.Td className="break-all">{element?.email}</Table.Td>
      <Table.Td>
        <Tooltip
          label="View Details"
          position="top"
        >
          <Link
            to={`./${element?.u_id}/details`}
            className="text-sm text-primary font-medium inline-flex"
          >
            <i className="icon-Through text-2xl/none"></i>
          </Link>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <div className="table-title flex-wrap">
        <div className="table-title-inner">
          <h6 className="lg:h2 md:h3 sm:h4">Patients</h6>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            size="sm-2"
            component={RdNavLink}
            to={`../add-patient`}
          >
            Add Patient
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
                label: "Pending",
                key: "pending",
                iconClass: "icon-in_queue",
              },
              {
                label: "Invited",
                key: "invited",
                iconClass: "icon-Invited",
              },
            ]}
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
      <Paper
        shadow="xs"
        mt={16}
        radius={12}
      >
        <ScrollArea
          type="always"
          scrollbarSize={6}
          scrollbars="x"
          offsetScrollbars
          classNames={{
            root: "w-full",
            viewport: "view-port-next-inner",
          }}
        >
          <Table
            verticalSpacing="md"
            miw={1100}
            layout="fixed"
            withRowBorders={false}
            striped
            stripedColor="background"
            highlightOnHover
            highlightOnHoverColor="primary.0"
            className="dml-list-table"
          >
            <Table.Thead className="border-b border-grey-low">
              <Table.Tr>
                <Table.Th className="w-20">ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th className="w-20">Details</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {patientQuery.isLoading ? (
                <TableLoader
                  rows={8}
                  columns={5}
                />
              ) : rows.length > 0 ? (
                rows
              ) : (
                <NoTableData colSpan={5} />
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
    </>
  );
};

export default Patients;
