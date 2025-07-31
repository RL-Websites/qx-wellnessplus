import { Image } from "@mantine/core";

const NoData = ({ imgClass = "w-auto mt-[120px] mb-10", titleClass = "h2 text-foreground mb-10", title = "No data available yet!" }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src="/images/Illustration-empty-table-data.png"
        fit="contain"
        className={`${imgClass}`}
      />
      <div className={`${titleClass}`}>{title}</div>
    </div>
  );
};

export default NoData;
