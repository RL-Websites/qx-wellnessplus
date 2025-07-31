import { ICommonParams } from "@/common/api/models/interfaces/Common.model";
import { IUsers } from "@/common/api/models/interfaces/User.model";
import userRepository from "@/common/api/repositories/userRepository";
import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import CustomFilter, { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import CustomSearchFilter from "@/common/components/SearchFilter";
import TableLoader from "@/common/components/TableLoader";
import Th from "@/common/components/Th";
import dmlToast from "@/common/configs/toaster.config";
import { convertUserableTypeNames, formatPhoneNumber } from "@/utils/helper.utils";
import { Button, ScrollArea, Table, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AddUser from "./components/AddUser";

function UserListPage() {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [openAddUserModal, addUserModalHandler] = useDisclosure();
  const [openEditUserModal, editUserModalHandler] = useDisclosure();
  const [userData, setUserData] = useState<IUsers[]>([]);
  const [sortColumn, setSortColumn] = useState<string>("id");
  const [sortDir, setSortDir] = useState<string | "asc" | "desc">("desc");
  const [editingUserId, setEditingUserId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState<string>();

  useEffect(() => {
    setTotalPages(Math.ceil(+totalCount / +pageSize));
  }, [pageSize, totalCount]);

  const items = [
    { title: "Settings", href: "/admin/settings" },
    { title: "User List", href: "" },
  ];

  const fetchUsersQueryFn = () => {
    const params: ICommonParams = {
      page: pageIndex,
      per_page: pageSize,
      sort_column: sortColumn,
      sort_direction: sortDir,
      search: searchText,
    };
    return userRepository.getAllUsers(params);
  };

  const usersQuery = useQuery({ queryKey: ["usersQuery", pageIndex, pageSize, sortColumn, sortDir, searchText], queryFn: fetchUsersQueryFn });

  useEffect(() => {
    if (usersQuery?.data?.data?.status_code == 200 && usersQuery?.data?.data?.data?.data) {
      setUserData(usersQuery?.data?.data?.data?.data);
      setShowing({ from: usersQuery.data?.data?.data?.from || 0, to: usersQuery.data?.data?.data?.to || 0 });
      setTotalCount(usersQuery?.data?.data?.data?.total || 0);
    }
  }, [usersQuery?.data, usersQuery?.isFetched]);

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const handleFilterChange = () => {
    setPageIndex(1);
  };

  const getStatusClassName = (status?: number) => {
    switch (status) {
      case 1:
        return "bg-green-low text-green-middle";
      case 0:
        return "bg-danger-light text-danger-deep";
      default:
        return "";
    }
  };

  const getStatusName = (status?: number) => {
    switch (status) {
      case 1:
        return "Active";
      case 0:
        return "Inactive";
      default:
        return status;
    }
  };

  const openEditUserModalFn = (u_id?: string) => {
    if (u_id) {
      setEditingUserId(u_id);
      setIsEditing(true);
      editUserModalHandler.open();
    } else {
      dmlToast.error({
        title: "User ID not found. Please try again later.",
      });
    }
  };

  const rows = userData.map((element, index) => (
    <Table.Tr key={index}>
      <Table.Td className="capitalize">{element?.name}</Table.Td>
      <Table.Td className="truncate">{element?.email}</Table.Td>
      <Table.Td>{formatPhoneNumber(element?.phone)}</Table.Td>
      <Table.Td>{element?.userable_type ? convertUserableTypeNames(element?.userable_type) : ""}</Table.Td>
      <Table.Td>{element?.client_name}</Table.Td>
      {/* <Table.Td>
        <label className="custom-switch">
          <input
            id={element?.id?.toString()}
            type="checkbox"
            checked={element?.is_active == 1 ? true : false}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          <span className="custom-switch-slider" />
        </label>
      </Table.Td> */}
      <Table.Td>
        <span className={`tags capitalize ${getStatusClassName(element?.is_active)}`}>{getStatusName(element?.is_active)}</span>
      </Table.Td>
      <Table.Td className="text-center">
        <Tooltip label="Edit User">
          <i
            className="icon-pencil-edit text-xl/none text-primary cursor-pointer"
            onClick={() => openEditUserModalFn(element?.u_id)}
          ></i>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  const onAddModalClose = (reason) => {
    addUserModalHandler.close();
    if (reason == "success") {
      usersQuery.refetch();
    }
  };
  const onEditModalClose = (reason) => {
    editUserModalHandler.close();
    setEditingUserId("");
    setIsEditing(false);

    if (reason == "success") {
      usersQuery.refetch();
    }
  };

  return (
    <>
      <div className="page-title flex-wrap">
        <div className="page-title-start">
          <h6 className="lg:h2 md:h3 sm:h4">User List</h6>
        </div>
        <div className="page-title-end flex-wrap">
          <div className="flex gap-3">
            <Button
              ms="auto"
              rightSection={<i className="icon-upload-04 text-base"></i>}
              className="bg-grey-btn text-foreground"
              disabled={true}
              size="sm-2"
            >
              Add in Bulk
            </Button>
            <Button
              color="secondary"
              className="ms-auto"
              size="sm-2"
              onClick={() => addUserModalHandler.open()}
            >
              Add User
            </Button>
          </div>
          <CustomSearchFilter onSearch={setSearchText} />
          <CustomFilter
            currentPage={pageIndex}
            filterParams={[
              {
                key: "all",
                label: "All",
                iconClass: "icon-dashboard",
              },
              {
                key: "Active",
                label: "Active",
                iconClass: "icon-checkbox-select",
              },
              {
                key: "Inactive",
                label: "Inactive",
                iconClass: "icon-approve-doctor",
              },
            ]}
            selectedFilter="All"
            disableFilter={false}
            onFilterChange={handleFilterChange}
          />
          <AddUser
            openModal={openAddUserModal}
            onModalClose={(reason) => onAddModalClose(reason)}
          />

          {isEditing ? (
            <AddUser
              openModal={openEditUserModal}
              onModalClose={(reason) => onEditModalClose(reason)}
              user_u_id={editingUserId}
              isEditing={true}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <DynamicBreadcrumbs
        items={items}
        separatorMargin="1"
      />
      <div className="card !p-0 mt-4">
        <ScrollArea>
          <Table
            verticalSpacing="md"
            withRowBorders={false}
            layout="auto"
            striped
            stripedColor="background"
            highlightOnHover
            highlightOnHoverColor="primary.0"
            className="dml-list-table"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="w-[160px]">User's Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Phone Number</Table.Th>
                <Th
                  sortBy="userable_type"
                  existingSort={sortColumn}
                  sortDir={sortDir}
                  onSort={(column, dir) => {
                    setSortColumn(column);
                    setSortDir(dir);
                  }}
                >
                  Role
                </Th>
                <Table.Th>Client</Table.Th>
                {/* <Table.Th>Set Status</Table.Th> */}
                <Th
                  sortBy="is_active"
                  existingSort={sortColumn}
                  sortDir={sortDir}
                  onSort={(column, dir) => {
                    setSortColumn(column);
                    setSortDir(dir);
                  }}
                >
                  Status
                </Th>
                <Table.Th className="text-center">Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {usersQuery.isLoading ? (
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
    </>
  );
}

export default UserListPage;
