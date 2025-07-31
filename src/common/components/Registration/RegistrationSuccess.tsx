import { Button, Image, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";
interface RegistrationSuccessPropTypes {
  needApproval?: boolean; // Indicates if the registration needs approval or not. Default is true.
  updateTitle?: string;
}
function RegistrationSuccess({ needApproval = true, updateTitle }: RegistrationSuccessPropTypes) {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const isMediumScreen = useMediaQuery("(min-width: 768px)");

  let buttonSize: "md" | "lg" = "md";
  if (isLargeScreen) {
    buttonSize = "lg";
  } else if (isMediumScreen) {
    buttonSize = "md";
  }
  return (
    <div className="flex flex-col py-12 items-center justify-center text-center">
      <Image
        className="img-fluid"
        src="/images/thank-you.png"
        w={450}
      />
      <Text
        className="text-4xl"
        mt={48}
        fw={700}
        c="secondary"
      >
        Thank You
      </Text>
      <div className="text-[#7C7C7C] mt-3 text-center">
        {updateTitle ? updateTitle : "Your application was successfully submitted to SalesPlus."}
        <br />
        {needApproval ? (
          "We will notify you once it has been approved."
        ) : (
          <div className="flex justify-center mt-5">
            <Link to="/login">
              <Button
                size={buttonSize}
                className="sm:w-[400px] w-[200px]"
              >
                Log In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
export default RegistrationSuccess;
