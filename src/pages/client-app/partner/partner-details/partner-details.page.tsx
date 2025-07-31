import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPartnerMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { IUpdatePartnerMedicationsDTO } from "@/common/api/models/interfaces/Partner.model";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import ClientPersonalInfo from "@/common/components/client/client-details/components/ClientPersonalInfo";
import NoTableData from "@/common/components/NoTableData";
import dmlToast from "@/common/configs/toaster.config";
import { trimPrice } from "@/utils/helper.utils";
import { ActionIcon, Button, Input, ScrollAreaAutosize, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddMedicine from "../../common/AddMedicine";
import PriceUpdateHistory from "../../common/PriceUpdateHistory";
interface ISelectedMedicineListItem extends IPartnerMedicineListItem {
  newPrice?: string;
}
const PartnerDetailsPage = () => {
  const { id: slug } = useParams();
  const [selectedMedicines, setSelectedMedicines] = useState<ISelectedMedicineListItem[]>([]);
  const [tempSelectedMedicines, setTempSelectedMedicines] = useState<ISelectedMedicineListItem[]>([]);
  const [editing, handleEditing] = useDisclosure();
  const [openAssignMeds, openAssignMedsHandler] = useDisclosure();
  const [openPriceHistoryModal, handlePriceHistoryModal] = useDisclosure();

  const { data, refetch } = useQuery({
    queryKey: ["partnerDetailsFromClient", slug],
    queryFn: () => partnerApiRepository.getPartnerDetails(slug),
    select: (response) => response.data.data as any,
  });

  const partnerData = data;

  useEffect(() => {
    const newMedList = data?.medicines?.map((item) => ({ ...item, id: item.medication_id, newPrice: item.price ? item.price.toString() : item.medicine?.total_price }));
    setTempSelectedMedicines(structuredClone(newMedList));
    setSelectedMedicines(newMedList?.length ? [...newMedList] : []);
  }, [data]);

  const menuItems = [
    {
      title: "Customer Account",
      href: "/client/partner-accounts",
    },
    {
      title: "Customer Details",
    },
  ];

  const statusMutation = useMutation({
    mutationFn: (payload: any) => {
      return partnerApiRepository.changePartnerStatus(payload);
    },
  });

  const handleStatusUpdate = (slug: string | undefined, status: string | undefined) => {
    if (slug && status) {
      const payload: any = { slug: slug, status: status };
      statusMutation.mutate(payload, {
        onSuccess: (res) => {
          refetch();
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
    }
  };

  const rows = selectedMedicines?.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td className="!pl-0">
        {item.medicine?.name} {item.medicine?.strength}
        {item.medicine?.unit}
      </Table.Td>
      <Table.Td className="!pl-0">${item.medicine?.total_price}</Table.Td>
      <Table.Td className="!pl-0 w-[158px]">
        {editing ? (
          <Input
            type="number"
            value={trimPrice(item.newPrice || "")}
            onChange={(e) => {
              const medList = [...selectedMedicines];
              medList[index].newPrice = e.target.value;
              setSelectedMedicines(medList);
            }}
          />
        ) : (
          <div>${item?.newPrice}</div>
        )}
      </Table.Td>
      {editing ? (
        <Table.Td className="text-right">
          <ActionIcon
            onClick={() => {
              const updated = [...selectedMedicines];
              updated.splice(index, 1);
              setSelectedMedicines([...updated]);
            }}
            variant="transparent"
            className="text-danger"
          >
            <i className="icon-delete text-xl/none"></i>
          </ActionIcon>
        </Table.Td>
      ) : (
        ""
      )}
    </Table.Tr>
  ));

  const editAssignMedsMutation = useMutation({ mutationFn: (payload: IUpdatePartnerMedicationsDTO) => partnerApiRepository.updatePartnerMedications(payload) });

  const saveAssignedMedicines = () => {
    const payload: IUpdatePartnerMedicationsDTO = {
      customer_id: partnerData?.id,
      medications: selectedMedicines ? selectedMedicines?.map((item) => ({ medication_id: Number(item?.id), price: Number(item?.newPrice) })) : [],
    };

    editAssignMedsMutation.mutate(payload, {
      onError: (err) => {
        const error = err as AxiosError<IServerErrorResponse>;
        dmlToast.error({ title: "An Error has occured", message: "error?.message" });
      },
      onSuccess: (res) => {
        dmlToast.success({ title: "Assigned Medications updated successfully." });
        refetch();
        handleEditing.close();
      },
    });
  };

  return (
    <>
      <div className="page-title">
        <h6 className="lg:h2 md:h3 sm:h4">Details Of {data?.account_name}</h6>
      </div>
      <DynamicBreadcrumbs
        separatorMargin="2"
        items={menuItems}
      />
      <div className="space-y-5">
        <ClientPersonalInfo
          clientDetails={partnerData}
          onStatusUpdate={handleStatusUpdate}
          soldQty={true}
        />

        <div className="card">
          <div className="card-title with-border flex items-center">
            <h6 className="text-lg font-bold">Assigned Medication</h6>
            {editing ? (
              <>
                <Button
                  variant="transparent"
                  className="ml-auto"
                  px={0}
                  classNames={{
                    label: "text-primary underline font-medium",
                  }}
                  onClick={openAssignMedsHandler.open}
                >
                  Assign More Medicine
                </Button>

                <Button
                  variant="transparent"
                  className="ml-4"
                  px={0}
                  classNames={{
                    label: "text-primary underline font-medium",
                  }}
                  onClick={() => {
                    setSelectedMedicines((prevSelectedMeds) => structuredClone(tempSelectedMedicines));
                    handleEditing.close();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  size="xs"
                  className="ml-4"
                  loading={editAssignMedsMutation?.isPending}
                  onClick={saveAssignedMedicines}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="transparent"
                  className="ml-auto"
                  px={0}
                  classNames={{
                    label: "text-primary underline font-medium",
                  }}
                  onClick={handlePriceHistoryModal.open}
                >
                  Price Update History
                </Button>
                <Button
                  variant="transparent"
                  className="ml-4"
                  px={0}
                  classNames={{
                    label: "text-primary underline font-medium",
                  }}
                  onClick={() => {
                    // setTempSelectedMedicines([...selectedMedicines]);
                    handleEditing.open();
                  }}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
          <div className="card-body">
            <ScrollAreaAutosize>
              <Table
                verticalSpacing="md"
                withRowBorders={false}
                stripedColor="background"
                highlightOnHover
                highlightOnHoverColor="primary.0"
                className="dml-list-table"
              >
                <Table.Thead className="border-b border-grey-low">
                  <Table.Tr>
                    <Table.Th className="!pl-0">Product Name</Table.Th>
                    <Table.Th className="!pl-0">Total Cost</Table.Th>
                    <Table.Th className="!pl-0">Selling Price</Table.Th>
                    {editing ? <Table.Th className="text-right">Action</Table.Th> : ""}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows?.length > 0 ? (
                    rows
                  ) : (
                    <NoTableData
                      imgClass="mt-0 mb-3 w-[200px]"
                      titleClass="font-semibold text-foreground text-lg"
                      title="No medication assigned"
                      colSpan={4}
                    />
                  )}
                </Table.Tbody>
              </Table>
            </ScrollAreaAutosize>
          </div>
        </div>
      </div>
      <AddMedicine
        openModal={openAssignMeds}
        onModalClose={(reason) => {
          if (reason === "submit") {
            openAssignMedsHandler.close();
          } else {
            openAssignMedsHandler.close();
          }
        }}
        prevMedicine={selectedMedicines.map((item) => ({
          ...{
            total_price: item.price,
            medication_id: item?.medication_id,
            price: item?.status,
            newPrice: item.price,
          },
          ...item.medicine,
        }))}
        onSave={(medicines) => {
          const newMedicines = medicines
            .filter((item) => !selectedMedicines.some((selected) => selected.id === item.id))
            .map((item) => ({
              medication_id: item?.id,
              price: item?.total_price || "",
              id: item?.id,
              medicine: item,
              newPrice: item?.total_price ? item?.total_price.toString() : "",
            }));
          const medicineList = [...selectedMedicines, ...newMedicines];
          setSelectedMedicines([...medicineList]);
        }}
      />

      <PriceUpdateHistory
        openModal={openPriceHistoryModal}
        onModalClose={handlePriceHistoryModal.close}
        partnerId={partnerData?.id}
      />
    </>
  );
};

export default PartnerDetailsPage;
