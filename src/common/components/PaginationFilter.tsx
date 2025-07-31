import { Select, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import dmlToast from "../configs/toaster.config";
import { dataPageSizes } from "../constants/constants";
import { IPaging } from "../models/paging";
import { IShowing } from "./CustomFilter";

export interface IFilterProps extends IPaging {
  showing: IShowing | null;
  updatePageSize: (pageSize: number) => void;
  updateCurrentPage: (pageIndex: number) => void;
}

export const PaginationFilter = (props: IFilterProps) => {
  const pageSizes = [...dataPageSizes];

  const [currentPage, setCurrentPage] = useState<number | "">(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    setCurrentPage(props.currentPage);
    setPageSize(props.pageSize);
    setTotalCount(props.totalCount);
    setTotalPages(Math.ceil(+props.totalCount / +props.pageSize));
  }, [props.currentPage, props.pageSize, props.totalCount]);

  const onChangeCurrentPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == "") {
      setCurrentPage(e.target.value);
      return;
    }
    const newValue = parseInt(e.currentTarget.value);

    if (isNaN(newValue)) {
      dmlToast.error({
        title: "Only numbers are allowed.",
      });
      return;
    }

    if (newValue <= 0) {
      dmlToast.error({
        title: "Invalid Page number.",
      });
      return;
    }

    if (+newValue > totalPages) {
      dmlToast.error({
        title: "Page number exceeds",
      });
      return;
    }
    setCurrentPage(newValue);
    props.updateCurrentPage(newValue);
  };

  const onChangePageSize = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1);
    props.updatePageSize(Number(value));
    props.updateCurrentPage(1);
    setTotalPages(Math.ceil(+totalCount / +value));
  };

  const handlePrev = () => {
    setCurrentPage(+props.currentPage - 1);
    props.updateCurrentPage(+props.currentPage - 1);
  };
  const handleNext = () => {
    setCurrentPage(+props.currentPage + 1);
    props.updateCurrentPage(+props.currentPage + 1);
  };

  return (
    <>
      {totalCount == 0 ? (
        ""
      ) : (
        <div className="sm:flex grid grid-cols-2 items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-fs-sm text-nowrap">Go To:</label>
            <input
              type="text"
              value={currentPage}
              onChange={onChangeCurrentPage}
              className="bg-white border-[2px] border-grey-btn rounded-md p-2.5 text-black w-[62px] h-10 text-fs-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className=" text-fs-sm text-nowrap ">Show Rows:</label>
            <Select
              data={pageSizes.map((item) => item.toString())}
              value={pageSize.toString()}
              onChange={(e) => onChangePageSize(e)}
              withCheckIcon={false}
              classNames={{
                wrapper: "bg-white  border-[2px] border-grey-btn rounded-md",
                input: "!text-fs-sm !text-foreground !leading-none px-2.5 text-black !h-9 !min-h-min w-[72px] relative z-100",
                dropdown: "shadow-md shadow-black/10",
              }}
              rightSection={<i className="icon-down-arrow text-foreground leading-none "></i>}
            />
          </div>

          <p className="block text-fs-sm text-nowrap">
            {props.showing && props.showing.from ? props.showing.from : 0} - {props.showing && props.showing.to ? props.showing.to : 0} of {totalCount}
          </p>
          <div className="flex items-center justify-end">
            <Tooltip
              label="Previous"
              position="bottom"
              offset={{ mainAxis: 0 }}
            >
              <button
                type="button"
                className={`inline-block w-6 bg-transparent mr-2 ${+props.currentPage <= 1 ? "cursor-not-allowed opacity-50" : " cursor-pointer"}`}
                disabled={+props.currentPage <= 1}
                onClick={handlePrev}
              >
                <i className="text-2xl text-black icon-prev-arrow "></i>
              </button>
            </Tooltip>

            <Tooltip
              label="Next"
              position="bottom"
              offset={{ mainAxis: 0 }}
            >
              <button
                type="button"
                className={`inline-block w-6 bg-transparent ${+props.currentPage >= totalPages ? "cursor-not-allowed opacity-50" : " cursor-pointer"}`}
                disabled={+props.currentPage >= totalPages}
                onClick={handleNext}
              >
                <i className="text-2xl text-black icon-next-arrow"></i>
              </button>
            </Tooltip>
          </div>
        </div>
      )}
    </>
  );
};
