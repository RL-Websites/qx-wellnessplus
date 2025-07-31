import { IGetSystemCodesParams } from "@/common/api/models/interfaces/SystemCodes.model";
import systemCodesRepository from "@/common/api/repositories/systemCodesRepository";
import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import CustomSearchFilter from "@/common/components/SearchFilter";
import TableLoader from "@/common/components/TableLoader";
import { ActionIcon, Button, Paper, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddCptCodes from "../components/AddCptCodes";

function CptCodePage() {
  const [cptCodes, setCptCodes] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [openSystemCode, setOpenSystemCodeHandler] = useDisclosure();
  const [selectedCptCode, setSelectedCptCode] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchText, setSearchText] = useState<string>();

  const items = [
    { title: "Settings", href: "/admin/settings" },
    { title: "Code", href: "" },
  ];

  const handleEditClick = (cptCodes: any) => {
    setSelectedCptCode(cptCodes);
    setIsEditMode(true);
    setOpenSystemCodeHandler.open();
  };

  const handleAddClick = () => {
    setSelectedCptCode(null);
    setIsEditMode(false);
    setOpenSystemCodeHandler.open();
  };

  useEffect(() => {
    setTotalPages(Math.ceil(+totalCount / +pageSize));
  }, [pageSize, totalCount]);

  const cptCodesQueryFn = () => {
    const params: IGetSystemCodesParams = {
      page: pageIndex,
      per_page: pageSize,
      code_type: "cpd",
      search: searchText,
    };
    return systemCodesRepository.getAllCodes(params);
  };

  const cptCodesQuery = useQuery({ queryKey: ["cpdCodesQuery", pageIndex, pageSize, searchText], queryFn: cptCodesQueryFn });

  useEffect(() => {
    if (cptCodesQuery?.data?.status == 200 && cptCodesQuery?.data?.data?.data?.data) {
      setCptCodes(cptCodesQuery?.data?.data?.data?.data);
      setShowing({ from: cptCodesQuery.data?.data?.data?.from || 0, to: cptCodesQuery.data?.data?.data?.to || 0 });
      setTotalCount(cptCodesQuery?.data?.data?.data?.total || 0);
    }
  }, [cptCodesQuery?.data, cptCodesQuery.isFetched]);

  const getStatusClassName = (status: number) => {
    switch (status) {
      case 1:
        return "bg-green-low text-green-middle";
      case 0:
        return "bg-danger-light text-danger";
      default:
        return "";
    }
  };

  const getStatusName = (status: string | number) => {
    if (typeof status === "number") {
      switch (status) {
        case 1:
          return "Active";
        case 0:
          return "Inactive";
        default:
          return "Unknown Status";
      }
    } else {
      switch (status.toLowerCase()) {
        case "active":
          return "Active";
        case "inactive":
          return "Inactive";
        default:
          return status;
      }
    }
  };

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const onSystemCodeModalClose = (reason) => {
    setSelectedCptCode(null);
    setIsEditMode(false);
    setOpenSystemCodeHandler.close();
    if (reason == "success") {
      cptCodesQuery.refetch();
    }
  };

  const rows = cptCodes.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td className="capitalize">{item.cpd_code}</Table.Td>
      <Table.Td>{item.note}</Table.Td>
      <Table.Td>
        <span className={`tags capitalize ${getStatusClassName(item?.status)}`}>{getStatusName(item?.status)}</span>
      </Table.Td>
      <Table.Td>
        <ActionIcon
          variant="transparent"
          onClick={() => handleEditClick(item)}
        >
          <i className="icon-pencil-edit text-2xl/none"></i>
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <div className="page-title">
        <div className="flex items-center gap-10">
          <h6 className="lg:h2 md:h3 sm:h4">Codes</h6>
          <div className="flex gap-9">
            <Button
              p="0"
              variant="transparent"
              className="h6 text-grey-medium !font-medium"
              component={Link}
              to="../icd-codes"
            >
              ICD Codes
            </Button>
            <Button
              p="0"
              variant="transparent"
              className="h6 text-foreground !font-bold"
              component={Link}
              to="../cpt-codes"
            >
              CPT Codes
            </Button>
          </div>
        </div>
        <div className="flex gap-3">
          <CustomSearchFilter onSearch={setSearchText} />
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
            ms="auto"
            rightSection={<i className="icon-stethoscope text-base"></i>}
            size="sm-2"
            onClick={handleAddClick}
          >
            Add Code
          </Button>
        </div>
        <AddCptCodes
          openModal={openSystemCode}
          onModalClose={(reason) => onSystemCodeModalClose(reason)}
          isEditMode={isEditMode}
          initialValues={selectedCptCode}
        />
      </div>
      <DynamicBreadcrumbs
        items={items}
        separatorMargin="1"
      />
      <Paper
        shadow="xs"
        radius={12}
        className="mt-5 pt-[5px] pb-1"
      >
        <Table.ScrollContainer
          minWidth={900}
          type="scrollarea"
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
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="w-[120px]">Code</Table.Th>
                <Table.Th>Code Details</Table.Th>
                <Table.Th className="w-[120px]">Status</Table.Th>
                <Table.Th className="w-20">Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {cptCodesQuery.isLoading ? (
                <TableLoader
                  rows={8}
                  columns={4}
                />
              ) : rows.length > 0 ? (
                rows
              ) : (
                <NoTableData colSpan={4} />
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
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
}

export default CptCodePage;
