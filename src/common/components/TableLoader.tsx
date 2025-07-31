import { Skeleton, Table } from "@mantine/core";

interface ITableLoaderProps {
  rows?: number;
  columns?: number;
  height?: number;
}

const TableLoader = ({ rows = 10, columns = 6, height = 28 }: ITableLoaderProps) => {
  return (
    <>
      {[...Array(rows)]?.map((_, rowKey) => (
        <Table.Tr key={rowKey}>
          {[...Array(columns)]?.map((_, columnKey) => (
            <Table.Td key={columnKey}>
              <Skeleton
                height={height}
                radius="md"
              />
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </>
  );
};

export default TableLoader;
