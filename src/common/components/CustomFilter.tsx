import { Button, Menu, ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react";

export interface IFilterParams {
  label: string;
  key: string;
  iconClass: string;
}
export interface IFilterProps {
  currentPage: number;
  filterParams?: string[] | IFilterParams[];
  disableFilter?: boolean;
  selectedFilter?: string;
  uniqueKey?: string;
  onFilterChange: (filterName: string, filterLabel?: string) => void;
}

export interface IShowing {
  from: number;
  to: number;
}

export const CustomFilter = (props: IFilterProps) => {
  const [filterParameter, setFilterParameter] = useState<string>(props.selectedFilter || "All");

  useEffect(() => {
    setFilterParameter(props.selectedFilter || "All");
  }, [props.selectedFilter]);

  const handleFilter = (filter: string, filterLabel: string) => {
    props.onFilterChange(filter, filterLabel);
    setFilterParameter(filterLabel);
  };

  return (
    <div
      className="flex items-center"
      key={props?.uniqueKey || "custom-filter"}
    >
      {props.filterParams && (
        <Menu
          shadow="lg"
          width={200}
          position="bottom-end"
          offset={10}
          disabled={props.disableFilter}
          transitionProps={{ transition: "pop-top-right", duration: 200 }}
        >
          <Menu.Target>
            <Button
              rightSection={<i className="icon-filter text-xl/none ml-2"></i>}
              variant="default"
              justify="space-between"
              h={40}
              px={12}
              className={`border-0 heading-xxxs capitalize ${props.disableFilter ? "cursor-not-allowed" : ""}`}
            >
              {filterParameter}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <ScrollArea.Autosize mah={300}>
              {props.filterParams?.map((fp, index) => (
                <Menu.Item
                  leftSection={<i className={"text-[15px]/none " + fp.iconClass}></i>}
                  onClick={() => {
                    handleFilter(fp.key, fp.label);
                  }}
                  key={index}
                >
                  {fp.label}
                </Menu.Item>
              ))}
            </ScrollArea.Autosize>
          </Menu.Dropdown>
        </Menu>
      )}
    </div>
  );
};

export default CustomFilter;
