import { IMedicineStatusUpdateDTO, IPartnerMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { IAssignedPartner } from "@/common/api/models/interfaces/Partner.model";
import addClientApiRepository from "@/common/api/repositories/clientRepositoiry";
import { medicineRepository } from "@/common/api/repositories/medicineRepository";
import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import { IShowing } from "@/common/components/CustomFilter";
import dmlToast from "@/common/configs/toaster.config";
import { getMedicineStatusClassName } from "@/utils/status.utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetailsPage() {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [attachedClinics, setAttachedClinics] = useState<IAssignedPartner[]>([]);
  const [productDetails, setProductDetails] = useState<IPartnerMedicineListItem>();
  const [assignedClinicSearch, setAssignedClinicSearch] = useState<string>("");
  const { id } = useParams();
  // const onCropped = (form: string | ArrayBuffer | null | File) => {
  //   ImageCropperModalHandler.close();
  // };
  const menuItems = [
    {
      title: "Medications",
      href: "/partner/products",
    },
    {
      title: `${productDetails?.medicine?.name} ${productDetails?.medicine?.strength}${productDetails?.medicine?.unit}`,
    },
  ];

  const medicineDetailsQuery = useQuery({
    queryKey: ["medicineEditQuery", id],
    queryFn: () => addClientApiRepository.getCustomerAssignedProductDetails(id || "", { module: "customer" }),
    enabled: !!id,
  });

  useEffect(() => {
    if (medicineDetailsQuery?.data?.data?.status_code == 200 && medicineDetailsQuery.data?.data?.data) {
      setProductDetails(medicineDetailsQuery.data?.data?.data);
    }
  }, [medicineDetailsQuery.isFetched, medicineDetailsQuery.data?.data]);

  // const fetchAttachedPartnersQuery = (med_id: string | undefined) => {
  //   const params: ICommonParams = {
  //     page: pageIndex,
  //     per_page: pageSize,
  //     search: assignedClinicSearch,
  //     medication_id: med_id || undefined,
  //   };

  //   return partnerApiRepository.getAttachedPartnersToMeds(params);
  // };

  // const attachedPartnersQuery = useQuery({
  //   queryKey: ["productAttachedPartnerQuery", assignedClinicSearch, id],
  //   queryFn: () => fetchAttachedPartnersQuery(id),
  //   enabled: !!id,
  // });

  // useEffect(() => {
  //   if (attachedPartnersQuery?.data?.data?.status_code == 200 && attachedPartnersQuery.data?.data?.data?.data) {
  //     setAttachedClinics(attachedPartnersQuery.data?.data?.data?.data);
  //     setTotalCount(attachedPartnersQuery.data?.data?.data?.total || 0);
  //     setShowing({ from: attachedPartnersQuery.data?.data?.data?.from || 0, to: attachedPartnersQuery.data?.data?.data?.to || 0 });
  //   }
  // }, [attachedPartnersQuery?.data?.data?.data?.data]);

  const productStatusUpdateMutation = useMutation({ mutationFn: (payload: IMedicineStatusUpdateDTO) => medicineRepository.changeStatus(payload) });

  const handleStatusChange = (id: string, status: number) => {
    const payload: IMedicineStatusUpdateDTO = {
      medication_id: id,
      status: status,
      module: "customer",
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

  return (
    <>
      <div className="page-title">
        <h6 className="lg:h2 md:h3 sm:h4">Medication Details</h6>
        {/* <Button
          size="sm-2"
          to={`/client/products/edit-product/${id}`}
          component={Link}
        >
          Edit
        </Button> */}
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
              <span className={`tags sm:w-20 w-14 capitalize ${getMedicineStatusClassName(productDetails?.medicine?.is_active || 0)}`}>
                {productDetails?.medicine?.is_active == 1 ? "Active" : "Inactive"}
              </span>
            </div>
            {/* <div>
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
                  {productDetails?.medicine?.is_active == 0 ? (
                    <Menu.Item
                      leftSection={<i className="icon-checkbox-select text-fs-md"></i>}
                      onClick={() => handleStatusChange(id || "", 1)}
                    >
                      Active
                    </Menu.Item>
                  ) : (
                    ""
                  )}
                  {productDetails?.medicine?.is_active == 1 ? (
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
            </div> */}
          </div>
          <div className="inner-wrapper">
            <div className="inner-wrapper-text !w-full">
              <div className="wrapper-text-flex md:pr-10">
                <div className="text-name">
                  <h6 className="text-secondary font-medium pb-2">Medication Name</h6>
                  <p className="text-grey-medium">{`${productDetails?.medicine?.name} ${productDetails?.medicine?.strength}${productDetails?.medicine?.unit}`}</p>
                </div>
                <div className="text-email">
                  <h6 className="text-secondary font-medium pb-2">Dose</h6>
                  <p className="text-grey-medium">{productDetails?.medicine?.strength || "N/A"}</p>
                </div>
                <div className="text-phone">
                  <h6 className="text-secondary extra-form-text-medium pb-2">Selling Price</h6>
                  <p className="text-grey-medium">${productDetails?.price || "0"}</p>
                </div>
                <div className="text-group">
                  <h6 className="text-secondary font-medium pb-2">Medication Group</h6>
                  <p className="text-grey-medium capitalize">{productDetails?.medicine?.medicine_group || "N/A"}</p>
                </div>
                <div className="text-type">
                  <h6 className="text-secondary font-medium pb-2">Medicine Type</h6>
                  <p className="text-grey-medium capitalize">{productDetails?.medicine?.medicine_type || "N/A"}</p>
                </div>
                <div className="text-phone">
                  <h6 className="text-secondary extra-form-text-medium pb-2">Doctor Fee</h6>
                  <p className="text-grey-medium">${productDetails?.medicine?.doctor_fee || "0"}</p>
                </div>
                <div className="text-phone">
                  <h6 className="text-secondary extra-form-text-medium pb-2">Shipping Fee</h6>
                  <p className="text-grey-medium">${productDetails?.medicine?.shipping_fee || "0"}</p>
                </div>
              </div>
              <div className="wrapper-text-flex md:pl-10">
                <div className="text-avail">
                  <h6 className="text-secondary extra-form-text-medium pb-2">SKU</h6>
                  <p className="text-grey-medium">{productDetails?.medicine?.sku || "N/A"}</p>
                </div>
                <div className="text-unit">
                  <h6 className="text-secondary font-medium pb-2">Unit</h6>
                  <p className="text-grey-medium">{productDetails?.medicine?.unit || "N/A"}</p>
                </div>
                <div className="text-pharmacy">
                  <h6 className="text-secondary font-medium pb-2">Preferred Pharmacy</h6>
                  <p className="text-grey-medium">{productDetails?.medicine?.pharmacy?.name || "N/A"}</p>
                </div>
                <div className="text-category">
                  <h6 className="text-secondary font-medium pb-2">Medicine Category</h6>
                  <p className="text-grey-medium">{productDetails?.medicine?.medication_category || "N/A"}</p>
                </div>
                <div className="text-avail">
                  <h6 className="text-secondary extra-form-text-medium pb-4">Price</h6>
                  <p className="text-grey-medium">${productDetails?.medicine?.price || "0"}</p>
                </div>
                <div className="text-avail">
                  <h6 className="text-secondary extra-form-text-medium pb-2">Service Fee</h6>
                  <p className="text-grey-medium">${productDetails?.medicine?.service_fee || "0"}</p>
                </div>
                <div className="text-phone">
                  <h6 className="text-secondary extra-form-text-medium pb-2">Research Only</h6>
                  <p className="text-grey-medium">{productDetails?.medicine?.is_research_only == "1" ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailsPage;
