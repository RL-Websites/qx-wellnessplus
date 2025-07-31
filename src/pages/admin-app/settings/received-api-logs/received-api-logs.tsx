import { IAPILogs } from "@/common/api/models/interfaces/ApiLogs.model";
import { ICommonParams } from "@/common/api/models/interfaces/Common.model";
import dashboardApiRepository from "@/common/api/repositories/dasboardRepository";
import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import CustomFilter, { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import TableLoader from "@/common/components/TableLoader";
import Th from "@/common/components/Th";
import { formatDate } from "@/utils/date.utils";
import { getApiLogStatusClassName, getApiLogStatusText } from "@/utils/status.utils";
import { getTimeFromDateString } from "@/utils/time.utils";
import { ScrollArea, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import RequestedData from "./requestedData";
import ShowErrorMessage from "./showErrorMessage";

function ReceivedApiLogsPage() {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  // const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [apiLogs, setApiLogs] = useState<IAPILogs[]>();
  const [sortColumn, setSortColumn] = useState<string>("id");
  const [sortDir, setSortDir] = useState<string | "asc" | "desc">("desc");
  const [apiLogId, setApiLogId] = useState<string>("");

  const [openShowErrorMessage, setOpenShowErrorMessage] = useDisclosure();
  const [openRequestData, setRequestDataModal] = useDisclosure();
  const items = [
    { title: "Settings", href: "/admin/settings" },
    { title: "Add User", href: "Received Api Logs" },
  ];

  const fetchApiLogs = () => {
    const params: ICommonParams = {
      page: pageIndex,
      per_page: pageSize,
      sort_column: sortColumn,
      sort_direction: sortDir,
    };
    return dashboardApiRepository.getApiLogs(params);
  };
  const apiLogsQuery = useQuery({ queryKey: ["apiLogQuery", pageIndex, pageSize, sortColumn, sortDir], queryFn: () => fetchApiLogs() });

  useEffect(() => {
    if (apiLogsQuery?.data?.data?.status_code == 200 && apiLogsQuery?.data?.data?.data?.data?.length) {
      setApiLogs(apiLogsQuery?.data?.data?.data?.data);
      setShowing({ from: apiLogsQuery?.data?.data?.data?.from || 0, to: apiLogsQuery?.data?.data?.data?.to || 0 });
      setTotalCount(apiLogsQuery?.data?.data?.data?.total || 0);
    }
  }, [apiLogsQuery?.data]);

  // useEffect(() => {
  //   setTotalPages(Math.ceil(+totalCount / +pageSize));
  // }, [pageSize, totalCount]);

  const openErrorMessageModal = (id) => {
    setApiLogId(id);
    setOpenShowErrorMessage.open();
  };
  const openRequestedDataModal = (id) => {
    setApiLogId(id);
    setRequestDataModal.open();
  };

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  return (
    <>
      <div className="page-title flex-wrap">
        <div className="page-title-start">
          <h6 className="lg:h2 md:h3 sm:h4">Received API Logs</h6>
        </div>
        <div className="page-title-end flex-wrap">
          <CustomFilter
            currentPage={1}
            filterParams={[
              {
                key: "all",
                label: "All",
                iconClass: "icon-dashboard",
              },
              {
                key: "success",
                label: "Success",
                iconClass: "icon-checkbox-select",
              },
              {
                key: "error",
                label: "Error",
                iconClass: "icon-approve-doctor",
              },
            ]}
            selectedFilter="All"
            disableFilter={false}
            onFilterChange={() => {}}
          />
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
                <Table.Th className="w-[160px]">SL No.</Table.Th>
                <Table.Th>Created Date</Table.Th>
                <Table.Th>Type</Table.Th>
                <Th
                  sortBy="userable_type"
                  existingSort={sortColumn}
                  sortDir={sortDir}
                  onSort={(column, dir) => {
                    setSortColumn(column);
                    setSortDir(dir);
                  }}
                >
                  Source
                </Th>
                <Table.Th>Request Data</Table.Th>
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
                  Error Message
                </Th>
                <Table.Th className="text-center">Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {apiLogsQuery.isLoading ? (
                <TableLoader
                  rows={8}
                  columns={7}
                />
              ) : apiLogs ? (
                apiLogs?.length > 0 ? (
                  apiLogs.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>#{(pageIndex - 1) * pageSize + index + 1}</Table.Td>
                      <Table.Td>
                        {item?.created_at ? formatDate(item?.created_at, "MMM DD, YYYY") : ""} <br />
                        {item?.created_at ? getTimeFromDateString(item?.created_at) : ""}
                      </Table.Td>
                      <Table.Td>{item?.type || ""}</Table.Td>
                      <Table.Td>{item?.source || ""}</Table.Td>
                      <Table.Td>
                        <div
                          className="tags !w-auto px-2 bg-grey-low cursor-pointer"
                          onClick={() => openRequestedDataModal(item?.id)}
                        >
                          Show Requested data
                        </div>
                      </Table.Td>
                      <Table.Td>
                        {item?.status == 0 ? (
                          <div
                            className="tags !w-auto px-2 bg-tag-bg cursor-pointer"
                            onClick={() => {
                              openErrorMessageModal(item?.id);
                            }}
                          >
                            Show Error Message
                          </div>
                        ) : (
                          ""
                        )}
                      </Table.Td>
                      <Table.Td className="text-center">
                        <div className={`tags ${getApiLogStatusClassName(item?.status)}`}>{getApiLogStatusText(item?.status)}</div>
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <NoTableData colSpan={7} />
                )
              ) : (
                <NoTableData colSpan={7} />
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <ShowErrorMessage
          openModal={openShowErrorMessage}
          modalDismiss={() => setOpenShowErrorMessage.close()}
          apiLogId={apiLogId}
        />
        <RequestedData
          openModal={openRequestData}
          modalDismiss={() => setRequestDataModal.close()}
          apiLogId={apiLogId}
        />
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

export default ReceivedApiLogsPage;
