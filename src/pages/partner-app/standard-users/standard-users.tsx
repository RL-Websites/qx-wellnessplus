import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import CustomSearchFilter from "@/common/components/SearchFilter";
import TableLoader from "@/common/components/TableLoader";
import { formatPhoneNumber } from "@/utils/helper.utils";
import { Button, Paper, ScrollArea, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AddPartnerUsers from "./add-partner-users";

export const StandardUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [addUserHandler, setAddUserHandler] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState<string>();

  useEffect(() => {
    setTotalPages(Math.ceil(+totalCount / +pageSize));
  }, [pageSize, totalCount]);

  const fetchUsers = () => {
    const params = {
      per_page: pageSize,
      sort_column: "created_at",
      sort_direction: "desc",
      module: "customer",
      page: pageIndex,
      search: searchTerm,
    };
    return partnerApiRepository.getPartnerUsers(params);
  };
  const userQuery = useQuery({ queryKey: ["userList", pageSize, pageIndex, searchTerm], queryFn: fetchUsers });

  useEffect(() => {
    if (userQuery.isFetched) {
      if (userQuery?.data?.status == 200) {
        setUsers(userQuery.data?.data?.data?.data || []);
        setTotalCount(userQuery.data?.data?.data?.total || 0);
        setShowing({ from: userQuery.data?.data?.data?.from || 0, to: userQuery.data?.data?.data?.to || 0 });
      }
    }
  }, [userQuery.data?.data?.data?.data]);

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const rows = users.map((element, index) => (
    <Table.Tr key={index}>
      <Table.Td>{++index}</Table.Td>
      <Table.Td>{element?.name}</Table.Td>
      <Table.Td>{element?.phone ? formatPhoneNumber(element?.phone) : ""}</Table.Td>
      <Table.Td className="break-all">{element?.email}</Table.Td>
      <Table.Td>
        <span className={`tags capitalize ${element?.is_active ? "bg-green-low text-green-middle" : "bg-danger-light text-danger-deep"}`}>
          {element?.is_active ? "Active" : "In Active"}
        </span>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <div className="table-title flex-wrap">
        <div className="table-title-inner">
          <h6 className="lg:h2 md:h3 sm:h4">Customer User Accounts</h6>
        </div>

        <div className="flex gap-3">
          <Button
            size="sm-2"
            onClick={() => setAddUserHandler.open()}
          >
            Add New User
          </Button>
          <CustomSearchFilter onSearch={setSearchTerm} />
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
            withRowBorders={false}
            striped
            stripedColor="background"
            highlightOnHover
            highlightOnHoverColor="primary.0"
            className="dml-list-table"
          >
            <Table.Thead className="border-b border-grey-low">
              <Table.Tr>
                <Table.Th>SL.NO</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Phone No.</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {userQuery.isLoading ? (
                <TableLoader
                  rows={8}
                  columns={7}
                />
              ) : rows.length > 0 ? (
                rows
              ) : (
                <NoTableData colSpan={7} />
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

      <AddPartnerUsers
        openModal={addUserHandler}
        onModalClose={() => {
          userQuery.refetch();
          setAddUserHandler.close();
        }}
      />
    </>
  );
};
