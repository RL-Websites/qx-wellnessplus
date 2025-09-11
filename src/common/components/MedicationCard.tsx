import { Button } from "@mantine/core";

interface IMedicationProps {
  image: string;
  title: string;
  cost: string;
  lab_fee?: number;
  disabled: boolean;
  onAddToCart: () => void;
  onShowDetails: () => void;
  selectedCategory?: string[];
}

const MedicationCard = (medicationProps: IMedicationProps) => {
  return (
    <div className="md:space-y-6 sm:space-y-4 space-y-3">
      <div
        className="md:space-y-4 sm:space-y-3 space-y-2"
        onClick={medicationProps?.onShowDetails}
      >
        {medicationProps.image && (
          <div className="rounded-[20px] flex justify-center overflow-hidden bg-[url(/images/thumb-bg.png)] bg-no-repeat bg-cover relative">
            <img
              src={medicationProps?.image}
              alt=""
              className="max-w-full min-h-[326px] mx-auto"
            />
            <span className="absolute size-8 top-4 right-4 rounded-full cursor-pointer">
              <i className="icon-info-2 text-4xl/none text-white"></i>
            </span>
          </div>
        )}
        {medicationProps?.title && (
          <h4 className="md:text-2xl sm:text-xl text-lg font-poppins leading-snug font-semibold text-foreground md:h-16 sm:h-8 line-clamp-2 break-all">{medicationProps?.title}</h4>
        )}
        <div className="">
          <p className="text-foreground text-sm  font-bold">Package Price</p>
          {medicationProps?.selectedCategory?.includes("Testosterone") ? (
            <div className="grid sm:grid-cols-2 gap-4 mt-3">
              <div className="flex flex-col justify-center items-center border-2 border-[#8FCADD] rounded-xl p-2">
                <span className="text-foreground text-sm">Without Lab</span>
                <span className="text-foreground sm:text-lg text-base font-bold">${medicationProps?.cost}</span>
              </div>
              <div className="flex flex-col justify-center items-center border-2 border-[#8FCADD] rounded-xl p-2">
                <span className="text-foreground text-sm">With Lab</span>
                <span className="text-foreground sm:text-lg text-base font-bold"> ${(Number(medicationProps?.cost) + Number(medicationProps?.lab_fee)).toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center border-2 border-[#8FCADD] rounded-xl p-2 mt-3">
              <span className="text-foreground sm:text-lg text-base font-bold">${medicationProps?.cost}</span>
            </div>
          )}
        </div>
      </div>
      <Button
        variant="outline"
        size="sm-2"
        color="primary"
        leftSection={<i className="icon-orders text-2xl/none"></i>}
        disabled={medicationProps.disabled}
        onClick={medicationProps?.onAddToCart}
        className={medicationProps.disabled ? "bg-grey-low cursor-not-allowed w-full" : "w-full"}
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default MedicationCard;
