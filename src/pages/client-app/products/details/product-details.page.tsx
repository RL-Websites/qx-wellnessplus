import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { ICommonParams } from "@/common/api/models/interfaces/Common.model";
import { IMedicineListItem, IMedicineStatusUpdateDTO } from "@/common/api/models/interfaces/Medication.model";
import { IAssignedPartnerStatusChangeDTO } from "@/common/api/models/interfaces/Partner.model";
import addClientApiRepository from "@/common/api/repositories/clientRepositoiry";
import { medicineRepository } from "@/common/api/repositories/medicineRepository";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import CustomSearchFilter from "@/common/components/SearchFilter";
import TableLoader from "@/common/components/TableLoader";
import dmlToast from "@/common/configs/toaster.config";
import { getMedicineStatusClassName } from "@/utils/status.utils";
import { ActionIcon, Avatar, Button, Menu, ScrollArea, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AssignNewPartner from "../components/AssignNewPartner";

function ProductDetailsPage() {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [openAssignClinicModal, handleAssignClinicModal] = useDisclosure();
  const [isAvailable, setIsAvailable] = useState(true);
  const [productDetails, setProductDetails] = useState<IMedicineListItem>();
  const [editingClinicId, setEditingClinicId] = useState<string>("");
  const [editingOfferPrice, setEditingOfferPrice] = useState<string>();
  const [editingClinicName, setEditingClinicName] = useState<string>("");
  const [assignedClinicSearch, setAssignedClinicSearch] = useState<string>("");
  const { id } = useParams();
  // const onCropped = (form: string | ArrayBuffer | null | File) => {
  //   ImageCropperModalHandler.close();
  // };
  const menuItems = [
    {
      title: "Medications",
      href: "/client/products",
    },
    {
      title: `${productDetails?.name}`,
    },
  ];

  const medicineDetailsQuery = useQuery({
    queryKey: ["medicineEditQuery", id],
    queryFn: () => addClientApiRepository.getClientProductDetails(id || ""),
    enabled: !!id,
  });

  useEffect(() => {
    if (medicineDetailsQuery?.data?.data?.status_code == 200 && medicineDetailsQuery.data?.data?.data) {
      setProductDetails(medicineDetailsQuery.data?.data?.data);
    }
  }, [medicineDetailsQuery.isFetched, medicineDetailsQuery.data?.data]);

  const fetchAttachedPartnersQuery = (med_id: string | undefined) => {
    const params: ICommonParams = {
      page: pageIndex,
      per_page: pageSize,
      search: assignedClinicSearch,
      medication_id: med_id || undefined,
    };

    return partnerApiRepository.getAttachedPartnersToMeds(params);
  };

  const attachedPartnersQuery = useQuery({
    queryKey: ["productAttachedPartnerQuery", assignedClinicSearch, id],
    queryFn: () => fetchAttachedPartnersQuery(id),
    enabled: !!id,
  });

  const attachedClinics = attachedPartnersQuery?.data?.data?.data;

  const productStatusUpdateMutation = useMutation({ mutationFn: (payload: IMedicineStatusUpdateDTO) => medicineRepository.changeStatus(payload) });

  const handleStatusChange = (id: string, status: number) => {
    const payload: IMedicineStatusUpdateDTO = {
      medication_id: id,
      status: status,
    };
    productStatusUpdateMutation.mutate(payload, {
      onSuccess: () => {
        medicineDetailsQuery.refetch();
        dmlToast.success({
          title: "Product status updated successfully",
        });
      },
      onError: (error) => {
        dmlToast.error({
          title: "Something went wrong!! Please try again.",
        });
        console.error(error);
      },
    });
  };

  const changeClinicStatusMn = useMutation({ mutationFn: (payload: IAssignedPartnerStatusChangeDTO) => partnerApiRepository.changeAttachedPartnerStatus(payload) });

  const changeClinicStatus = (medicineId, customerId, isChecked) => {
    const payload: IAssignedPartnerStatusChangeDTO = {
      medication_id: medicineId,
      customer_id: customerId,
      status: isChecked ? "1" : "0",
    };

    changeClinicStatusMn.mutate(payload, {
      onSuccess: (res) => {
        console.log(res);
        dmlToast.success({ title: "Changed medicine availability successfully" });
        attachedPartnersQuery.refetch();
      },
      onError: (err) => {
        const error = err as AxiosError<IServerErrorResponse>;
        console.log(error);
        dmlToast.error({ title: error.message });
      },
    });
  };

  const closeAssignClinicModal = (reason) => {
    if (reason == "success") {
      attachedPartnersQuery.refetch();
    }
    setIsEdit(false);
    setEditingClinicId("");
    setEditingClinicName("");
    setEditingOfferPrice("");
    handleAssignClinicModal.close();
  };

  const handleEditClinic = (clinicId, offerPrice, clinicName) => {
    setIsEdit(true);
    setEditingClinicId(clinicId);
    setEditingClinicName(clinicName);
    setEditingOfferPrice(offerPrice);
    handleAssignClinicModal.open();
  };

  const handleAssignClinic = () => {
    setIsEdit(false);

    handleAssignClinicModal.open();
  };

  const rows = attachedClinics
    ? attachedClinics.map((item, index) => (
        <Table.Tr key={index}>
          <Table.Td>{item?.customer?.account_name}</Table.Td>
          <Table.Td>
            <label className="custom-switch">
              <input
                id="availability"
                type="checkbox"
                checked={item?.is_active == 1 ? true : false}
                onChange={(e) => changeClinicStatus(productDetails?.id, item?.customer_id, e.target.checked)}
              />
              <span className="custom-switch-slider" />
            </label>
          </Table.Td>
        </Table.Tr>
      ))
    : [];

  return (
    <>
      <div className="page-title">
        <h6 className="lg:h2 md:h3 sm:h4">Medication Details</h6>
        <Button
          size="sm-2"
          to={`/client/products/edit-product/${id}`}
          component={Link}
        >
          Edit
        </Button>
      </div>
      <DynamicBreadcrumbs
        items={menuItems}
        separatorMargin="1"
      />
      <div className="space-y-5">
        <div className="dml-profile-content-inner">
          <div className="inner-title">
            <div className="flex items-center gap-2.5">
              <h6>Medication Information</h6>
              {productDetails?.is_active !== undefined && (
                <span className={`tags sm:w-20 w-14 capitalize ${getMedicineStatusClassName(productDetails.is_active)}`}>
                  {productDetails.is_active === 1 ? "Active" : "Inactive"}
                </span>
              )}
            </div>
            <div>
              <Menu
                shadow="md"
                width={200}
                position={"bottom-end"}
              >
                <Menu.Target>
                  <ActionIcon className="bg-transparent hover:bg-grey-low">
                    <i className="icon-dot text-foreground"></i>
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  {productDetails?.is_active == 0 ? (
                    <Menu.Item
                      leftSection={<i className="icon-checkbox-select text-fs-md"></i>}
                      onClick={() => handleStatusChange(id || "", 1)}
                    >
                      Active
                    </Menu.Item>
                  ) : (
                    ""
                  )}
                  {productDetails?.is_active == 1 ? (
                    <Menu.Item
                      leftSection={<i className="icon-approve-doctor text-fs-md"></i>}
                      onClick={() => handleStatusChange(id || "", 0)}
                    >
                      Inactive
                    </Menu.Item>
                  ) : (
                    ""
                  )}
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
          <div className="inner-wrapper">
            <div className="inner-wrapper-thumb">
              <Avatar
                src={productDetails?.image ? `${import.meta.env.VITE_BASE_PATH}/storage/${productDetails?.image}` : "/images/product-img-placeholder.jpg"}
                size={208}
                radius={10}
              >
                <img
                  src={"/images/product-img-placeholder.jpg"}
                  alt=""
                />
              </Avatar>
            </div>
            <div className="inner-wrapper-text">
              <div className="wrapper-text-flex md:pr-10">
                <div className="text-name">
                  <h6 className="text-secondary font-medium pb-2">Medication Name</h6>
                  <p className="text-grey-medium">{`${productDetails?.name}`}</p>
                </div>
                <div className="text-dose">
                  <h6 className="text-secondary font-medium pb-2">Dose</h6>
                  <p className="text-grey-medium">{productDetails?.strength + " " + productDetails?.unit || "N/A"}</p>
                </div>
                <div className="text-group">
                  <h6 className="text-secondary font-medium pb-2">Medication Group</h6>
                  <p className="text-grey-medium capitalize">{productDetails?.medicine_group || "N/A"}</p>
                </div>
                <div className="text-type">
                  <h6 className="text-secondary font-medium pb-2">Medicine Type</h6>
                  <p className="text-grey-medium capitalize">{productDetails?.medicine_type || "N/A"}</p>
                </div>
                <div className="text-phone">
                  <h6 className="text-secondary extra-form-text-medium pb-2">Doctor Fee</h6>
                  <p className="text-grey-medium">${productDetails?.doctor_fee || "0"}</p>
                </div>
                <div className="text-phone">
                  <h6 className="text-secondary extra-form-text-medium pb-2">Shipping Fee</h6>
                  <p className="text-grey-medium">${productDetails?.shipping_fee || "0"}</p>
                </div>
                <div className="text-phone">
                  <h6 className="text-secondary extra-form-text-medium pb-2">Research Only</h6>
                  <p className="text-grey-medium">{productDetails?.is_research_only == "1" ? "Yes" : "No"}</p>
                </div>
              </div>
              <div className="wrapper-text-flex md:pl-10">
                <div className="text-avail">
                  <h6 className="text-secondary extra-form-text-medium pb-2">SKU</h6>
                  <p className="text-grey-medium">{productDetails?.sku || "N/A"}</p>
                </div>
                <div className="text-unit">
                  <h6 className="text-secondary font-medium pb-2">Unit</h6>
                  <p className="text-grey-medium">{productDetails?.unit || "N/A"}</p>
                </div>
                <div className="text-pharmacy">
                  <h6 className="text-secondary font-medium pb-2">Preferred Pharmacy</h6>
                  <p className="text-grey-medium">{productDetails?.pharmacy?.name || "N/A"}</p>
                </div>
                <div className="text-category">
                  <h6 className="text-secondary font-medium pb-2">Medicine Category</h6>
                  <p className="text-grey-medium">{productDetails?.medication_category || "N/A"}</p>
                </div>
                <div className="text-avail">
                  <h6 className="text-secondary extra-form-text-medium pb-4">Price</h6>
                  <p className="text-grey-medium">${productDetails?.price || "0"}</p>
                </div>
                <div className="text-avail">
                  <h6 className="text-secondary extra-form-text-medium pb-2">Service Fee</h6>
                  <p className="text-grey-medium">${productDetails?.service_fee || "0"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-title flex flex-wrap items-center justify-between">
            <div className="card-title-start">
              <h6>Assign Customer Account {attachedClinics?.length ? `(${attachedClinics?.length})` : ""}</h6>
            </div>
            <div className="card-title-end flex sm:flex-row flex-col items-center sm:gap-7 gap-2">
              <Button
                variant="transparent"
                className="p-0 text-primary"
                onClick={handleAssignClinic}
              >
                Assign New Customer Account
              </Button>
              <CustomSearchFilter onSearch={setAssignedClinicSearch} />
            </div>
          </div>
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
                  <Table.Th>Customer Account Name</Table.Th>
                  <Table.Th className="w-[120px]">Availability</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {attachedPartnersQuery?.isLoading ? (
                  <TableLoader
                    rows={6}
                    columns={2}
                  />
                ) : rows?.length > 0 ? (
                  rows
                ) : (
                  <NoTableData
                    imgClass="mt-4 w-[200px]"
                    colSpan={2}
                    titleClass="!text-2xl mt-3 font-semibold"
                  />
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </div>
        {productDetails?.dosage_directions != undefined && productDetails?.dosage_directions?.length > 0 ? (
          <div className="card p-6">
            <div className="card-title with-border">
              <h6>Additional Information</h6>
            </div>
            <div className="pt-2">
              <Table
                withRowBorders={false}
                className="-ml-2.5 info-table info-table-md"
              >
                <Table.Tbody>
                  {productDetails?.dosage_directions?.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Th>{item?.title}:</Table.Th>
                      <Table.Td>
                        <div
                          className="tiptap-output"
                          dangerouslySetInnerHTML={{ __html: item?.details }}
                        ></div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <AssignNewPartner
        isEdit={isEdit}
        openModal={openAssignClinicModal}
        onModalClose={(reason) => closeAssignClinicModal(reason)}
        medicinePrice={productDetails?.price}
        medicineId={productDetails?.id?.toString()}
        clinicId={editingClinicId}
        offerPrice={editingOfferPrice}
        clinicName={editingClinicName}
        assignedClinicIds={attachedClinics?.map((medication) => medication.customer_id.toString())}
      />
    </>
  );
}

export default ProductDetailsPage;
