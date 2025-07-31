import { IGetPriceHistoryParams } from "@/common/api/models/interfaces/Common.model";
import { medicineRepository } from "@/common/api/repositories/medicineRepository";
import { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { formatDate } from "@/utils/date.utils";
import { getTimeFromDateString } from "@/utils/time.utils";
import { ActionIcon, Modal, ScrollArea, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ModalProps {
  openModal: boolean;
  onModalClose: (reason: string) => void;
  partnerId?: string;
}

const PriceUpdateHistory = ({ openModal, onModalClose, partnerId }: ModalProps) => {
  const [medicineHistoryList, setMedicineHistoryList] = useState<any>();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);

  const handleModalClose = () => {
    onModalClose("cancel");
  };

  const fetchPriceHistory = () => {
    const params: IGetPriceHistoryParams = {
      per_page: pageSize,
      customer_id: partnerId || "",
      page: pageIndex,
    };
    return medicineRepository.getPriceHistoryList(params);
  };

  const priceHistoryQuery = useQuery({ queryKey: ["priceHistoryQuery", partnerId, openModal], queryFn: () => fetchPriceHistory(), enabled: !!partnerId && !!openModal });

  useEffect(() => {
    if (priceHistoryQuery?.data?.data?.status_code == 200 && priceHistoryQuery?.data?.data?.data?.data) {
      setMedicineHistoryList(priceHistoryQuery?.data?.data?.data?.data || []);
      setTotalCount(priceHistoryQuery.data?.data?.data?.total || 0);
      setShowing({ from: priceHistoryQuery.data?.data?.data?.from || 0, to: priceHistoryQuery.data?.data?.data?.to || 0 });
    }
  }, [priceHistoryQuery?.data?.data?.data?.data]);

  const rows = medicineHistoryList?.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td className="!pl-0">{item?.medication}</Table.Td>
      <Table.Td className="!pl-0">${item.old_price}</Table.Td>
      <Table.Td className="!pl-0">${item.new_price}</Table.Td>
      <Table.Td className="!pl-0 text-right">
        {formatDate(item.created_at, "MMM DD, YYYY")}
        {item?.created_at ? getTimeFromDateString(item?.created_at) : ""}
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Modal.Root
      centered
      size={1024}
      opened={openModal}
      onClose={handleModalClose}
      closeOnClickOutside={false}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Price Update History</Modal.Title>
          <ActionIcon
            onClick={handleModalClose}
            radius="100%"
            bg="dark"
            size="24"
          >
            <i className="icon-cross1 text-xs"></i>
          </ActionIcon>
        </Modal.Header>
        <Modal.Body>
          <ScrollArea
            type="always"
            scrollbarSize={6}
            h={250}
          >
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
                  <Table.Th className="!pl-0 text-nowrap">Medication Name</Table.Th>
                  <Table.Th className="!pl-0 text-nowrap">Previous Price</Table.Th>
                  <Table.Th className="!pl-0 text-nowrap">Update Price</Table.Th>
                  <Table.Th className="!pl-0 text-nowrap text-right">Price Update Date</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows?.length && rows?.length > 0 ? (
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
          </ScrollArea>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default PriceUpdateHistory;
