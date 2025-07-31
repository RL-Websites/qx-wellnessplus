import { Button, Group, Image, Text } from "@mantine/core";
import { Link } from "react-router-dom";

interface AlreadySubmittedPropTypes {
  title: string;
  tagLine?: string;
  userType?: string;
}

const AllreadySubmitted = ({ title, tagLine, userType }: AlreadySubmittedPropTypes) => {
  const shouldShowWellnessLogo = ["client", "customer", "partner_patient", "customer_standard_user"].includes(userType ?? "");

  return (
    <section className="bg-background xl:px-0 px-4 min-h-screen flex flex-col">
      <Group
        className="dr-header-container w-full lg:justify-between justify-center"
        py={{ base: 80, sm: 50 }}
      >
        <div className="flex sm:flex-row flex-col items-center sm:gap-6 gap-2">
          <Image
            className="img-fluid sm:w-auto w-[150px]"
            src="/images/wellness-logo.svg"
            alt="SalesPlus"
          />
        </div>
        <div className="md:text-end text-center">
          <Text className="md:heading-xl heading-md fw-bold">{title}</Text>
          <Text className="text-fs-lg">{tagLine ? tagLine : "Your request was successfully submitted"}</Text>
        </div>
      </Group>
      <div className="bg-background flex flex-col py-12 items-center justify-center text-center">
        <Image
          className="img-fluid"
          src="/images/thank-you.png"
          w={450}
        />

        <h4 className="text-foreground my-10">Your have already registered with SalesPlus.</h4>
        <Link to="/login">
          <Button
            size="lg"
            w={400}
          >
            Log In
          </Button>
        </Link>
      </div>
      <div className="bg-white py-5 mt-auto">
        <div className="dr-header-container">
          <Text className="text-fs-xs text-center">Copyright &copy; 2024 Wellness Plus. All rights reserved.</Text>
        </div>
      </div>
    </section>
  );
};

export default AllreadySubmitted;
