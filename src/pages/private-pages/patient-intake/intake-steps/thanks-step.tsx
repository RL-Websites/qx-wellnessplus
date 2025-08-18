import { user_id } from "@/common/states/user.atom";
import { Button } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect } from "react";

const ThanksStep = () => {
  const [userId, setUserId] = useAtom(user_id);

  useEffect(() => {
    console.log(userId);
  }, [userId]);

  const goToDosvanaDashboard = () => {
    window.open(`${import.meta.env.VITE_DOSVANA_URL}/oauth/${userId}`, "_blank");
  };
  return (
    <div className="grid grid-cols-5 items-center gap-[132px] pt-20">
      <div className="col-span-2">
        <img
          src="/images/thanks.png"
          alt=""
          className="mx-auto"
        />
      </div>
      <div className="col-span-3 space-y-12">
        <h2 className="heading-text text-foreground uppercase">Thank You</h2>
        <p className="text-2xl font-poppins text-foreground">
          An agent will contact with you shortly. To access your account please check your email.
          <span className="font-semibold pt-12 inline-block">Please wait... It will redirect to your dashboard!</span>
        </p>
        <Button
          className="w-[206px]"
          onClick={goToDosvanaDashboard}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ThanksStep;
