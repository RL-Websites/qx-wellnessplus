import { Button } from "@mantine/core";

const ThanksStep = () => {
  return (
    <div className="grid grid-cols-5 items-center gap-[132px] pt-20">
      <div className="col-span-2">
        <img
          src="./public/images/thanks.png"
          alt=""
          className="mx-auto"
        />
      </div>
      <div className="col-span-3 space-y-12">
        <h2 className="heading-text text-foreground uppercase">Thank You</h2>
        <p className="text-2xl font-poppins text-foreground font-poppins">
          An agent will contact with you shortly. To access your account please check your email.
          <span className="font-semibold pt-12 inline-block">Please wait... It will redirect to your dashboard!</span>
        </p>
        <Button className="w-[206px]">Go to Dashboard</Button>
      </div>
    </div>
  );
};

export default ThanksStep;
