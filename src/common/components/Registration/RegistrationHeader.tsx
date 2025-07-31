import { Group, Image, Text } from "@mantine/core";

interface RegistrationHeaderPropTypes {
  title: string;
  tagLine: string;
  userType?: string;
}

const RegistrationHeader = ({ title, tagLine, userType }: RegistrationHeaderPropTypes) => {
  const shouldShowWellnessLogo = ["client", "partner", "partner_patient", "customer_standard_user"].includes(userType ?? "");

  return (
    <Group
      className="dr-header-container w-full lg:justify-between justify-center"
      py={{ base: 50, sm: 50, md: 80 }}
    >
      <div className="flex sm:flex-row flex-col items-center sm:gap-6 gap-2">
        <Image
          className="img-fluid sm:w-auto w-[150px]"
          src="/images/wellness-logo.svg"
          alt="SalesPlus"
        />
      </div>
      <div className="text-center">
        {title && <Text className="md:heading-xl heading-md fw-bold mb-3">{title}</Text>}
        {tagLine && <Text className="text-fs-lg">{tagLine}</Text>}
        {/* <Text className="heading-xl fw-bold mb-3">Invitation for Clinic</Text>
        {currentStep < 3 ? (
          currentStep == 2 ? (
            <Text className=" text-fs-lg">Please review the form to submit your request</Text>
          ) : (
            <Text className=" text-fs-lg">Please fill up the form to submit your request</Text>
          )
        ) : (
          <Text className=" text-fs-lg">Your request was successfully submitted</Text>
        )} */}
      </div>
    </Group>
  );
};

export default RegistrationHeader;
