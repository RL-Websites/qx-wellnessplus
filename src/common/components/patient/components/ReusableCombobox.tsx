import { CheckIcon, Combobox, Group, Pill, PillsInput, ScrollArea, useCombobox } from "@mantine/core";
import { useEffect, useState } from "react";

export interface DmlComboBoxDataType {
  id: number;
  code: string;
  note: string;
}

interface ReusableComboboxProps {
  label: string;
  data: DmlComboBoxDataType[];
  selectedValues: DmlComboBoxDataType[];
  onSelectionChange: (values: DmlComboBoxDataType[]) => void;
  pillsInputHeight?: string;
  limit?: number;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
}

function ReusableCombobox({ label, data, selectedValues, onSelectionChange, pillsInputHeight, limit, onSearchChange, isLoading }: ReusableComboboxProps) {
  const [search, setSearch] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const handleValueSelect = (val: string) => {
    const selectedItem = data.find((item) => item.id.toString() === val);
    if (selectedItem) {
      onSelectionChange(selectedValues.includes(selectedItem) ? selectedValues.filter((item) => item.id !== selectedItem.id) : [...selectedValues, selectedItem]);
    }
  };

  const handleValueRemove = (item: DmlComboBoxDataType) => {
    onSelectionChange(selectedValues.filter((value) => value.id !== item.id));
  };

  const renderPills = () =>
    selectedValues.map((item) => (
      <Pill
        key={item.id}
        withRemoveButton
        onRemove={() => handleValueRemove(item)}
        classNames={{
          root: "bg-white rounded-lg border border-foreground h-[30px]",
          label: "text-sm/5 h-5",
        }}
      >
        {item?.code} {item?.note?.substring(0, 120)}
      </Pill>
    ));

  const renderOptions = () => {
    let options;
    // console.log(data);
    if (limit) {
      options = data.filter((item) => !selectedValues.some((selected) => selected.id === item.id)).slice(0, limit <= data.length ? limit : data.length - 1);
    } else {
      options = data.filter((item) => !selectedValues.some((selected) => selected.id === item.id));
    }

    if (options.length === 0) {
      if (isLoading) {
        return <Combobox.Empty>Loading...</Combobox.Empty>;
      } else if (search.trim() === "" && !isLoading) {
        return <Combobox.Empty>Please type at least 3 letters to search your desired code.</Combobox.Empty>;
      } else if (search.length > 2 && !isLoading) {
        return <Combobox.Empty>Nothing found...</Combobox.Empty>;
      } else {
        return <Combobox.Empty>All options selected</Combobox.Empty>;
      }
    } else {
      return options.map((item) => (
        <Combobox.Option
          key={item.id}
          value={item.id.toString()}
          active={selectedValues.some((selected) => selected.id === item.id)}
        >
          <Group gap="sm">
            {selectedValues.some((selected) => selected.id === item.id) ? <CheckIcon size={12} /> : null}
            <span>{`${item?.code} ${item.note?.substring(0, 120)}`}</span>
          </Group>
        </Combobox.Option>
      ));
    }
  };

  const handleSearchChange = (value: string) => {
    combobox.updateSelectedOptionIndex();
    if (value.toString().length > 2) {
      onSearchChange(value);
    }
  };

  useEffect(() => {
    renderOptions();
  }, [data]);

  return (
    <div>
      <span className="extra-form-text-medium text-foreground pb-2 inline-block">{label}</span>
      <Combobox
        store={combobox}
        onOptionSubmit={handleValueSelect}
        withinPortal={false}
        classNames={{
          dropdown: "!w-1/2 !left-0 !shadow-lg",
        }}
      >
        <Combobox.DropdownTarget>
          <PillsInput
            onClick={() => combobox.openDropdown()}
            classNames={{
              input: `${pillsInputHeight}`,
            }}
          >
            <Pill.Group className=" flex-col-reverse items-start">
              <div className="flex flex-wrap items-center gap-2">{renderPills()}</div>

              <Combobox.EventsTarget>
                <PillsInput.Field
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  placeholder="Search values"
                  onChange={(event) => {
                    setSearch(event.currentTarget.value);
                    handleSearchChange(event.currentTarget.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && search.length === 0) {
                      event.preventDefault();
                      if (selectedValues.length) {
                        handleValueRemove(selectedValues[selectedValues.length - 1]);
                      }
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <ScrollArea.Autosize
            type="always"
            mah={200}
            scrollbarSize={6}
          >
            <Combobox.Options>{renderOptions()}</Combobox.Options>
          </ScrollArea.Autosize>
        </Combobox.Dropdown>
      </Combobox>
    </div>
  );
}

export default ReusableCombobox;
