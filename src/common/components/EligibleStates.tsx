import { IEligibleState } from "@/common/api/models/interfaces/EligibleStates.model";
import DocumentTag from "@/common/components/DocumentTag";
import { Locations } from "@/common/constants/locations";
import { ActionIcon, Button, List, Modal, Select, Text } from "@mantine/core";
import { useEffect, useState } from "react";

function EligibleStates({
  isOpen,
  onClose,
  stateIds,
  isEditing = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  stateIds: IEligibleState[] | undefined;
  isEditing?: boolean;
}) {
  const [compStateIds, setCompStateIds] = useState<{ id: string; name: string }[]>([]);
  const [initialStateIds, setInitialStateIds] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const initialIds = stateIds?.map((item) => ({ id: item?.id ? item?.id?.toString() : "", name: item?.name })) || [];
    setCompStateIds(initialIds);
    setInitialStateIds(initialIds);
  }, [stateIds]);

  const handleUndo = () => {
    setCompStateIds(initialStateIds);
  };

  const handleRemoveState = (id: string) => {
    setCompStateIds((prevStateIds) => prevStateIds.filter((state) => state.id !== id));
  };

  return (
    <Modal.Root
      opened={isOpen}
      onClose={onClose}
      closeOnClickOutside={false}
      centered
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>States Eligible to Work</Modal.Title>
          <ActionIcon
            className="focus-visible:!outline-none"
            onClick={onClose}
            radius="100%"
            bg="dark"
            size="24"
          >
            <i className="icon-cross1 text-xs"></i>
          </ActionIcon>
        </Modal.Header>
        <Modal.Body>
          {isEditing && (
            <Select
              label="Add State"
              rightSection={<i className="icon-down-arrow text-sm"></i>}
              searchable
              classNames={{
                wrapper: "bg-grey-btn rounded-md",
              }}
              placeholder="All"
              data={Locations.filter((item) => item.type.toLowerCase() === "state").map((state) => ({
                value: state.id.toString(),
                label: state.name,
              }))}
              onChange={(value, option) => value && setCompStateIds((prevStateIds) => [...prevStateIds, { id: value, name: option.label }])}
            />
          )}

          <Text
            fw={500}
            className="text-fs-md text-secondary mt-3"
          >
            Eligible States (<span>{stateIds?.length}</span>):
          </Text>

          <List className="doctor-client flex flex-wrap gap-4 text-nowrap mt-5">
            {compStateIds?.map((item, index) => (
              <DocumentTag
                badgeColor="bg-tag-bg text-foreground"
                key={index}
                badgeText={item.name}
                childrenOne
                actions={
                  isEditing
                    ? [
                        {
                          icon: <i className="icon-cross1 text-xs"></i>,
                          onClick: () => handleRemoveState(item.id),
                        },
                      ]
                    : []
                }
                childrenTwo={!isEditing}
              />
            ))}
          </List>

          {isEditing && (
            <div className="flex items-center gap-2 mt-10">
              <Button
                variant="default"
                w="100%"
                onClick={handleUndo}
              >
                Undo
              </Button>
              <Button
                w="100%"
                type="submit"
              >
                Save
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default EligibleStates;
