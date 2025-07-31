import { IconRosetteDiscountCheck } from "@tabler/icons-react";

function SuccessContent() {
  return (
    <div className="max-w-[550px] mx-auto text-center h-full flex flex-col justify-center">
      <span className="flex justify-center">
        <IconRosetteDiscountCheck
          stroke={2}
          size={80}
          color="green"
        />
      </span>
      <p className="text-xl text-secondary font-normal pt-5">
        We've just sent a password reset link to the email associated with your account. Please check your inbox and follow the instructions in the
        email to reset your password. If you don't receive the email within a few minutes, please check your spam folder.
      </p>
    </div>
  );
}

export default SuccessContent;
