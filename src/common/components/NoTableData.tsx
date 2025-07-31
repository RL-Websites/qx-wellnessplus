import { Image, Table } from "@mantine/core";

interface INoTableDataProps {
  colSpan: number;
  imgClass?: string;
  titleClass?: string;
  title?: string;
}

const NoTableData = ({
  colSpan = 5,
  imgClass = "w-auto mt-[120px] mb-10",
  titleClass = "h2 text-foreground mb-10",
  title = "No data available yet!",
}: INoTableDataProps) => {
  return (
    <Table.Tr className="table-no-data">
      <Table.Td colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/images/Illustration-empty-table-data.png"
            fit="contain"
            className={`${imgClass}`}
          />
          <div className={`${titleClass}`}>{title}</div>
        </div>
      </Table.Td>
    </Table.Tr>
  );
};

export default NoTableData;
