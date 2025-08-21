function SuccessContent() {
  return (
    <div className=" mx-auto text-center h-full flex flex-col justify-center">
      <div className="mt-10 w-full border-dashed border border-primary cursor-pointer rounded-lg bg-primary-secondary p-5">
        <p className="text-xl text-secondary font-normal ">
          We've just sent a password reset link to the email associated with your account. Please check your inbox and follow the instructions in the email to reset your password.
          If you don't receive the email within a few minutes, please check your spam folder.
        </p>
      </div>
    </div>
  );
}

export default SuccessContent;
