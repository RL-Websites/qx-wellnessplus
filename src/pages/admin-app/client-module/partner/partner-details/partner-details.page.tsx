import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPartnerMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import ClientPersonalInfo from "@/common/components/client/client-details/components/ClientPersonalInfo";
import NoTableData from "@/common/components/NoTableData";
import dmlToast from "@/common/configs/toaster.config";
import { Button, ScrollAreaAutosize, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PriceUpdateHistory from "../../common/PriceUpdateHistory";

interface ISelectedMedicineListItem extends IPartnerMedicineListItem {
  newPrice?: string;
}

const PartnerDetailsPage = () => {
  const { id: slug } = useParams();
  const [openPriceHistoryModal, handlePriceHistoryModal] = useDisclosure();
  const [selectedMedicines, setSelectedMedicines] = useState<ISelectedMedicineListItem[]>([]);

  const { data, refetch, isFetched } = useQuery({
    queryKey: ["clinicDetails", slug],
    queryFn: () => partnerApiRepository.getPartnerDetails(slug),
    select: (response) => response.data.data as any,
  });

  const partnerData = data;

  const menuItems = [
    {
      title: "Customer Account",
      href: "/admin-client/partner-account",
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

  useEffect(() => {
    const newMedList = data?.medicines?.map((item) => ({ ...item, id: item.medication_id, newPrice: item.price || item.old_price }));
    setSelectedMedicines(newMedList?.length ? [...newMedList] : []);
  }, [data]);

  const rows = selectedMedicines?.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td className="!pl-0">{item.medicine.name}</Table.Td>
      <Table.Td className="!pl-0 text-end">${item.medicine?.price}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <div className="page-title">
        <h6 className="lg:h2 md:h3 sm:h4">Details Of {partnerData?.account_name || ""}</h6>
      </div>
      <DynamicBreadcrumbs
        separatorMargin="2"
        items={menuItems}
      />
      <div className="space-y-5">
        <ClientPersonalInfo
          clientDetails={partnerData}
          onStatusUpdate={handleStatusUpdate}
          associatedClient={true}
        />
        <div className="card">
          <div className="card-title with-border flex items-center">
            <h6 className="text-lg font-bold">Assigned Medication</h6>
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
                    <Table.Th className="!pl-0">Medicine Name</Table.Th>
                    <Table.Th className="!pl-0 text-end">Price</Table.Th>
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
                      colSpan={2}
                    />
                  )}
                </Table.Tbody>
              </Table>
            </ScrollAreaAutosize>
          </div>
        </div>
      </div>
      <PriceUpdateHistory
        openModal={openPriceHistoryModal}
        onModalClose={handlePriceHistoryModal.close}
        partnerId={partnerData?.id}
      />
    </>
  );
};

export default PartnerDetailsPage;
