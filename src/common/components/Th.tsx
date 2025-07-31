import { Center, Group, rem, Table, Text, UnstyledButton } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons-react";
import { useState } from "react";

interface ThProps {
  children: React.ReactNode;
  sortBy: string;
  sortDir: string | "asc" | "desc";
  existingSort: string;
  onSort: (sortCol, sortDir) => void;
}

const Th = ({ children, sortBy, existingSort, sortDir, onSort }: ThProps) => {
  const Icon = sortBy == existingSort ? (sortDir == "asc" ? IconChevronUp : IconChevronDown) : IconSelector;

  const [reverseSortDirection, setReverseSortDirection] = useState<boolean>(false);

  const setSorting = (field: string) => {
    const reversed = field === existingSort ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    // setSortBy(field);
    // setSortColumn(field);
    const sortDirection = field == existingSort ? (sortDir == "desc" ? "asc" : "desc") : "asc";
    onSort(field, sortDirection);
  };
  return (
    <Table.Th>
      <UnstyledButton onClick={() => setSorting(sortBy)}>
        <Group justify="space-between">
          <Text
            fw={600}
            fz="sm"
          >
            {children}
          </Text>
          <Center>
            <Icon
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
};

export default Th;
