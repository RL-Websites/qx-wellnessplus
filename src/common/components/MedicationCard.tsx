import { Button } from "@mantine/core";
import ThumbBg from "./ThumbBg";

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
    <div className="space-y-6">
      <div
        className="space-y-4"
        onClick={medicationProps?.onShowDetails}
      >
        {medicationProps.image && (
          <ThumbBg>
            <img
              src={medicationProps?.image}
              alt=""
              className="max-w-full h-[250px] mx-auto"
            />
          </ThumbBg>
        )}
        {medicationProps?.title && <h4 className="text-2xl font-poppins leading-snug font-semibold text-foreground">{medicationProps?.title}</h4>}
        <div className="flex items-center justify-between">
          <span className="text-foreground text-base font-bold">Medication Cost</span>
          <span className="text-foreground text-base font-bold">${medicationProps?.cost}</span>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm-2"
        color="primary"
        leftSection={<i className="icon-orders text-2xl/none"></i>}
        disabled={medicationProps.disabled}
        classNames={{
          root: "w-full",
        }}
        onClick={medicationProps?.onAddToCart}
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default MedicationCard;
