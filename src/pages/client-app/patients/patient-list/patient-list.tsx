import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import CustomSearchFilter from "@/common/components/SearchFilter";
import TableLoader from "@/common/components/TableLoader";
import { formatPhoneNumber } from "@/utils/helper.utils";
import { Paper, ScrollArea, Table, Tooltip } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";

const PatientList = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string[]>(["pending", "invited"]);

  // const navigate = useNavigate();

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
      search: searchText || undefined,
    };
    return partnerApiRepository.getAllClientPatients(params);
  };
  const patientQuery = useQuery({ queryKey: ["patientList", pageSize, pageIndex, statusFilter, searchText], queryFn: fetchPatients });

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

  // const handleFilterChange = (filter) => {
  //   if (filter == "") {
  //     setStatusFilter(["pending", "invited"]);
  //   } else {
  //     setStatusFilter([filter]);
  //   }
  //   setPageIndex(1);
  //   navigate("/client/patients");
  // };

  // const selectedFilter = statusFilter.length === 1 ? statusFilter[0] : "All Status";

  const rows = patients.map((element, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        {element?.first_name} {element?.last_name}
      </Table.Td>
      <Table.Td>{element?.cell_phone ? formatPhoneNumber(element?.cell_phone) : ""}</Table.Td>
      <Table.Td className="break-all">{element?.email}</Table.Td>
      <Table.Td className="text-center">{element?.prescriptions_count}</Table.Td>
      <Table.Td>
        <Tooltip
          label="View Details"
          position="top"
        >
          <NavLink
            to={`./${element?.u_id}/details`}
            className="text-sm text-primary font-medium inline-flex"
          >
            <i className="icon-Through text-2xl/none"></i>
          </NavLink>
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

        <div className="flex gap-3">
          <CustomSearchFilter onSearch={setSearchText} />
        </div>
      </div>
      <Paper
        shadow="xs"
        mt={16}
        radius={12}
      >
        <ScrollArea>
          <Table
            verticalSpacing="md"
            miw={1100}
            withRowBorders={false}
            striped
            stripedColor="background"
            highlightOnHover
            highlightOnHoverColor="primary.0"
            className="dml-list-table"
          >
            <Table.Thead className="border-b border-grey-low">
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th className="text-nowrap">Phone No.</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th className="text-center">Prescriptions</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {patientQuery.isLoading ? (
                <TableLoader
                  rows={8}
                  columns={6}
                />
              ) : rows.length > 0 ? (
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
    </>
  );
};

export default PatientList;
