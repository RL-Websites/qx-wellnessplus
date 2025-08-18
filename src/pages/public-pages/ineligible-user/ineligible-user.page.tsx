import { Button } from "@mantine/core";
import { Link } from "react-router-dom";

export default function InEligibleUser() {
  return (
    <div className="lg:pt-16 md:pt-10 pt-4 ">
      <h2 className="heading-text  text-foreground uppercase  text-center max-w-[800px] mx-auto">We're Unable to Proceed with Treatment</h2>
      <p className="text-2xl leading-relaxed md:mt-12 mt-8 max-w-[900px] mx-auto text-center">
        Based on the medical information you’ve provided, it appears that you may have a condition that makes treatment with this medication unsafe at this time. For your safety,
        we recommend consulting with your personal healthcare provider before pursuing any further treatments.
      </p>
      <div className="text-center md:mt-12 mt-8">
        <Button
          variant="outline"
          className="w-[200px]"
          component={Link}
          to="/"
        >
          Go Back to Home
        </Button>
      </div>
    </div>
  );
}
