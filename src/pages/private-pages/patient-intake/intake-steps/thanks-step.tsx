import { user_id } from "@/common/states/user.atom";
import { Button } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";

const ThanksStep = ({ isActive }: { isActive: boolean }) => {
  const [userId, setUserId] = useAtom(user_id);
  const openedRef = useRef(false);

  useEffect(() => {
    if (!isActive || !userId || openedRef.current) return;

    const url = `${import.meta.env.VITE_DOSVANA_URL}/oauth/${userId}`;
    const timer = setTimeout(() => {
      if (openedRef.current) return; // extra guard
      openedRef.current = true;
      // window.location(url, "_blank", "noopener,noreferrer");
      // window.location.href = url;
      window.location.replace(url);
    }, 10000);
  }, []);

  const goToDosvanaDashboard = () => {
    window.open(`${import.meta.env.VITE_DOSVANA_URL}/oauth/${userId}`, "_blank");
  };
  return (
    <div className="grid md:grid-cols-5 items-center lg:gap-[132px] md:gap-20 gap-10 lg:pt-20 md:pt-12 pt-8">
      <div className="md:col-span-2">
        <img
          src="/images/thanks.png"
          alt=""
          className="mx-auto md:max-w-auto max-w-[200px]"
        />
      </div>
      <div className="md:col-span-3 md:space-y-12 space-y-3 md:text-left text-center">
        <h2 className="heading-text text-foreground uppercase">Thank You</h2>
        <p className="lg:text-2xl md:text-xl text-lg font-poppins text-foreground mt-6">
          {/* An agent will contact with you shortly. To access your account please check your email. */}
          <span className="font-semibold md:pt-6 pt-5 inline-block">Please wait...</span> <br />
          <span className="font-semibold md:pt-4 pt-5 inline-block"> We will redirect to your dashboard shortly!</span>
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
