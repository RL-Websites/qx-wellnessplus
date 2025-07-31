import { Button } from "@mantine/core";

interface ePrescribeProps {
  prescribedData: any;
}
function HandleEprescription({ prescribedData }: ePrescribeProps) {
  const checkDoseSpot = () => {
    console.log("prescribedData", prescribedData);
  };
  return (
    <Button
      size="sm-2"
      w="100%"
      onClick={checkDoseSpot}
      rightSection={<i className="icon-stethoscope text-base/none"></i>}
    >
      E-Prescribe Now asdf
    </Button>
  );
}

export default HandleEprescription;
