import { Button } from "@mantine/core";
import ThumbBg from "./ThumbBg";

interface IMedicationProps {
  image: string;
  title: string;
  const: string;
}

const MedicationCard = (medicationProps: IMedicationProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {medicationProps.image && (
          <ThumbBg>
            <img
              src={medicationProps?.image}
              alt=""
              className="max-w-full h-[250px] mx-auto"
            />
          </ThumbBg>
        )}
        {medicationProps?.title && <h4 className="text-2xl font-semibold text-foreground">{medicationProps?.title}</h4>}
        <div className="flex items-center justify-between">
          <span className="text-foreground text-base font-bold">Medication Cost</span>
          <span className="text-foreground text-base font-bold">{medicationProps?.const}</span>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm-2"
        color="primary"
        leftSection={<i className="icon-orders text-2xl/none"></i>}
        classNames={{
          root: "w-full",
        }}
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default MedicationCard;
