import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IRequestReportToPatientDTO } from "@/common/api/models/interfaces/labTest.model";
import labTestApiRepository from "@/common/api/repositories/labTestRepository";
import dmlToast from "@/common/configs/toaster.config";
import { Button, Checkbox, Combobox, FocusTrap, Group, Modal, Pill, PillsInput, ScrollArea, useCombobox } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface ModalProps {
  openModal: boolean;
  onModalClose: () => void;
  doctor_id?: number;
  prescription_u_id?: string;
}

// const testOptions = [
//   { value: "all", label: "Select All" },
//   { value: "CBC", label: "CBC" },
//   { value: "RBC", label: "RBC" },
//   { value: "Estrogen Level", label: "Estrogen Level" },
//   { value: "Prolactin Level", label: "Prolactin Level" },
//   { value: "Insulin Sensitivity", label: "Insulin Sensitivity" },
// ];

function RequestTestReport({ openModal, onModalClose, doctor_id, prescription_u_id }: ModalProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [labTestLists, setLabTestLists] = useState<any[]>([]);

  const handleValueSelect = (val: string) => {
    if (val === "all") {
      if (allSelected) {
        setValue([]);
        setAllSelected(false);
      } else {
        setValue(labTestLists.filter((option) => option.id !== "all").map((option) => option.id));
        setAllSelected(true);
      }
    } else {
      setValue((current) => (current.includes(val) ? current.filter((v) => v !== val) : [...current, val]));
    }
  };

  const handleValueRemove = (val: string) => {
    setValue((current) => current.filter((v) => v !== val));
  };

  useEffect(() => {
    if (value.length === labTestLists.length - 1 && !allSelected) {
      setAllSelected(true);
    } else if (value.length !== labTestLists.length - 1 && allSelected) {
      setAllSelected(false);
    }
  }, [value, allSelected]);

  const requestReportMutation = useMutation({
    mutationFn: (payload: IRequestReportToPatientDTO) => labTestApiRepository.requestReportToPatient(payload),
  });

  const dismissModal = () => {
    setValue([]);
    onModalClose();
  };

  const handleReportRequest = () => {
    if (doctor_id && prescription_u_id && value?.length) {
      const payload: IRequestReportToPatientDTO = {
        doctor_id: doctor_id,
        prescription_u_id: prescription_u_id,
        lab_test_ids: value,
      };
      requestReportMutation.mutate(payload, {
        onSuccess: () => {
          dmlToast.success({
            title: "Lab Test Request Sent Successfully",
          });
          onModalClose();
        },
        onError: (err) => {
          console.log(err);
          const error = err as AxiosError<IServerErrorResponse>;
          dmlToast.error({
            message: error?.response?.data?.message,
            title: "Oops! Something went wrong",
          });
        },
      });
    }
  };

  const labTestQueryFn = () => {
    const params = {
      status: 1,
    };
    return labTestApiRepository.getLabTestLists(params);
  };
  const labTestQuery = useQuery({ queryKey: ["labTestQuery"], queryFn: labTestQueryFn });
  useEffect(() => {
    if (labTestQuery?.data?.status === 200 && labTestQuery?.data?.data?.data?.data) {
      const selectAll = { id: "all", name: "Select All" };
      const newLabTestLists = [...labTestQuery.data.data.data.data] || [];
      newLabTestLists.unshift(selectAll);
      // newLabTestLists[0] = selectAll;
      setLabTestLists(newLabTestLists);
    }
  }, [labTestQuery.isFetched, labTestQuery.data]);

  const values = value.map((item) => (
    <Pill
      key={item}
      withRemoveButton
      onRemove={() => handleValueRemove(item)}
      styles={{
        root: {
          height: "30px",
          borderRadius: "8px",
          background: "transparent",
          border: "1px solid var(--dml-color-grey-medium)",
        },
        label: {
          lineHeight: "28px",
          fontSize: "var(--dml-para-fs-sm)",
        },
        remove: {
          fontSize: "16px",
        },
      }}
    >
      {labTestLists?.find((option) => option.id === item)?.name}
    </Pill>
  ));

  const options = labTestLists
    ?.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .map((item) => (
      <Combobox.Option
        value={item.id}
        key={item.id}
        active={value.includes(item.id)}
        style={item.id === "all" ? { borderBottom: "1px solid var(--dml-color-grey-low)", borderRadius: "0px" } : {}}
      >
        <Group gap="sm">
          {item.id !== "all" && (
            <Checkbox
              checked={value.includes(item.id)}
              onChange={() => {}}
              aria-hidden
              tabIndex={-1}
              style={{ pointerEvents: "none" }}
              label={item.name}
            />
          )}
          {item.id === "all" && <span>{allSelected ? "Deselect All" : "Select All"}</span>}
        </Group>
      </Combobox.Option>
    ));

  return (
    <Modal.Root
      opened={openModal}
      onClose={dismissModal}
      centered
      w="544px"
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header className="!pb-0">
          <Modal.Title>Request a Report</Modal.Title>
          <div className="flex items-center gap-3">
            <i
              onClick={dismissModal}
              className="icon-cross text-xl leading-6 cursor-pointer"
            ></i>
          </div>
        </Modal.Header>
        <Modal.Body className="!pr-0 !py-6">
          <ScrollArea
            type="always"
            scrollbarSize={6}
            scrollbars="y"
            offsetScrollbars
            classNames={{
              root: "h-[370px]",
              viewport: "view-port-next-inner pr-5",
            }}
          >
            <div className="w-[calc(432px_-_48px)]">
              <FocusTrap.InitialFocus />
              <div className="flex flex-col gap-2 relative">
                <Combobox
                  store={combobox}
                  onOptionSubmit={handleValueSelect}
                  withinPortal={false}
                >
                  <Combobox.DropdownTarget>
                    <PillsInput
                      onClick={() => combobox.openDropdown()}
                      label="Test Name"
                      classNames={{
                        input: "!h-12 !min-h-full",
                      }}
                    >
                      <Pill.Group className="h-full">
                        <Combobox.EventsTarget>
                          <PillsInput.Field
                            onFocus={() => combobox.openDropdown()}
                            onBlur={() => combobox.closeDropdown()}
                            value={search}
                            className="h-full"
                            placeholder="Search test name"
                            onChange={(event) => {
                              combobox.updateSelectedOptionIndex();
                              setSearch(event.currentTarget.value);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Backspace" && search.length === 0) {
                                event.preventDefault();
                                handleValueRemove(value[value.length - 1]);
                              }
                            }}
                          />
                        </Combobox.EventsTarget>
                      </Pill.Group>
                    </PillsInput>
                  </Combobox.DropdownTarget>

                  <Combobox.Dropdown className="!left-0">
                    <ScrollArea.Autosize
                      type="always"
                      mah={200}
                      scrollbarSize={6}
                    >
                      <Combobox.Options>{options?.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}</Combobox.Options>
                    </ScrollArea.Autosize>
                  </Combobox.Dropdown>
                  <div className={`flex flex-col gap-2 pt-4 min-h-[200px] ${value.length == 0 ? "invisible" : ""}`}>
                    <div className="border border-grey-low rounded-xl flex flex-col divide-y divide-grey-low">
                      <h6 className="heading-xxxs text-foreground px-4 py-2.5">Tests Added</h6>
                      <Pill.Group className="p-4">{values}</Pill.Group>
                    </div>
                  </div>
                </Combobox>
              </div>
              <div className="flex justify-end gap-2 pt-8">
                <Button
                  bg="grey.4"
                  c="foreground"
                  w="246px"
                  onClick={dismissModal}
                >
                  Cancel
                </Button>
                <Button
                  w="246px"
                  disabled={!value?.length}
                  loading={requestReportMutation?.isPending}
                  onClick={handleReportRequest}
                >
                  Request
                </Button>
              </div>
            </div>
          </ScrollArea>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default RequestTestReport;
