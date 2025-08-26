import { Button } from "@mantine/core";

interface IMedicationProps {
  image: string;
  title: string;
  cost: string;
  disabled: boolean;
  onAddToCart: () => void;
  onShowDetails: () => void;
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
          <h4 className="md:text-2xl sm:text-xl text-lg font-poppins leading-snug font-semibold text-foreground md:h-16 sm:h-8 line-clamp-2">{medicationProps?.title}</h4>
        )}
        <div className="flex items-center justify-between">
          <span className="text-foreground sm:text-base text-sm font-bold">Medication Cost</span>
          <span className="text-foreground sm:text-base text-sm font-bold">${medicationProps?.cost}</span>
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
