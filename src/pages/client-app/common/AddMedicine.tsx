import { IMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import CustomSearchFilter from "@/common/components/SearchFilter";
import { ActionIcon, Button, Checkbox, Modal, ScrollArea, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ModalProps {
  openModal: boolean;
  onModalClose: (reason: string) => void;
  prevMedicine: any[] | undefined;
  onSave: (medicines: IMedicineListItem[]) => void;
}

interface MedicineItems extends IMedicineListItem {
  isSelected?: boolean;
}

function AddMedicine({ openModal, onModalClose, prevMedicine, onSave }: ModalProps) {
  const [medicines, setMedicines] = useState<MedicineItems[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<MedicineItems[]>([]);
  const [filteredList, setFilteredList] = useState<MedicineItems[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeString, setTimeString] = useState(new Date().getTime());

  const params = {
    noPaginate: true,
    sort_column: "updated_at",
    sort_direction: "desc",
    status: ["1"],
  };

  useEffect(() => {
    console.log(openModal);
    console.log(timeString);
  }, [openModal]);

  const getMedicineList = useQuery({ queryKey: ["assignNewMedsList", timeString, openModal], queryFn: () => partnerApiRepository.getAllMedicines(params), enabled: !!openModal });

  useEffect(() => {
    if (getMedicineList.isFetched && medicines.length === 0) {
      if (getMedicineList?.data?.data?.status_code === 200) {
        if (Array.isArray(getMedicineList?.data?.data?.data)) {
          setMedicines(getMedicineList?.data?.data?.data || []);
          setFilteredList(getMedicineList?.data?.data?.data || []);
        }
      }
    }
  }, [getMedicineList?.data?.data?.data]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    if (searchTerm) {
      const items = medicines.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredList([...items]);
    } else {
      setFilteredList([...medicines]);
    }
  }, [searchTerm, medicines]);

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedMedicines([]);
    } else {
      setSelectedMedicines((prevSelected) => [...filteredList]);
    }
  };

  const allSelected = filteredList.length === selectedMedicines?.length && filteredList.every((item) => selectedMedicines.some((m) => m.id === item.id));

  useEffect(() => {
    if (prevMedicine) {
      setSelectedMedicines(prevMedicine);
    }
  }, [prevMedicine]);

  const handleCheckboxChange = (item: IMedicineListItem) => {
    const isSelected = selectedMedicines.some((m) => m.id === item.id);
    if (isSelected) {
      setSelectedMedicines((prevSelected) => prevSelected.filter((m) => m.id !== item.id));
    } else {
      setSelectedMedicines((prevSelected) => [...prevSelected, item]);
    }
  };

  const handleModalClose = () => {
    setSelectedMedicines([]);
    onModalClose("cancel");
  };

  return (
    <Modal.Root
      centered
      size={540}
      opened={openModal}
      onClose={handleModalClose}
      closeOnClickOutside={false}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Assign Medication</Modal.Title>
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
          <div className="flex flex-col gap-2.5">
            <CustomSearchFilter onSearch={handleSearch} />

            {filteredList.length > 0 && (
              <span
                className="underline text-primary p-0 border-b border-b-grey-light pb-3 text-sm cursor-pointer"
                onClick={toggleSelectAll}
              >
                {allSelected ? "Deselect All" : "Select All"}
              </span>
            )}

            <div className="space-y-3">
              <div className="table-header flex items-center justify-between">
                <span className="text-sm font-bold text-grey">Name</span>
                <span className="text-sm font-bold text-grey">Price</span>
              </div>

              <ScrollArea.Autosize
                type="scroll"
                mah={200}
                scrollbarSize={6}
                offsetScrollbars
              >
                <div className="flex flex-col gap-5">
                  {getMedicineList?.isLoading ? (
                    <>
                      <Skeleton height={40} />
                      <Skeleton height={40} />
                    </>
                  ) : filteredList.length > 0 ? (
                    filteredList.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="w-[calc(100%_-_100px)]">
                            <Checkbox
                              checked={selectedMedicines.some((m) => m.id === item.id)}
                              onChange={() => handleCheckboxChange(item)}
                              label={`${item.name} ${item.strength}${item.unit}`}
                              classNames={{ label: "text-foreground" }}
                            />
                          </div>
                          <div>
                            <span className="text-foreground">${item.total_price}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-lg text-grey pt-4">No medicine found</div>
                  )}
                </div>
              </ScrollArea.Autosize>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="light"
                  className="mt-6 mx-auto w-1/2"
                  onClick={handleModalClose}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="mt-6 mx-auto w-[calc(100%_-_50%)]"
                  onClick={() => {
                    onSave(selectedMedicines);
                    onModalClose("submit");
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default AddMedicine;
