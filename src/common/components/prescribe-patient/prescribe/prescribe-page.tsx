import { Avatar, Button, Stack } from "@mantine/core";
import { NavLink as RdNavLink } from "react-router-dom";

interface ILinkProps {
  newPatient?: string;
  oldPatient?: string;
}

function PrescribeCommonPage({ newPatient, oldPatient }: ILinkProps) {
  return (
    <div className="flex flex-col gap-6 max-w-[890px] mx-auto">
      <div className="card md:p-8 p-6 flex flex-col sm:flex-row  lg:gap-[110px] md:gap-16 gap-6">
        <div className="card-thumb flex justify-center sm:justify-start items-end flex-shrink-0">
          <Avatar
            src="/images/prescribe-new.png"
            size="180px"
            radius="0"
          />
        </div>
        <Stack
          gap={0}
          className="items-center sm:items-start"
        >
          <h6 className="text-foreground mb-2">Prescribe a New Patient</h6>
          <p className="extra-form-text-regular text-center sm:text-left pb-2.5 max-w-[330px]">You can easily add a new patient right here in just a few steps!</p>
          <Button
            className="mt-0 sm:mt-auto"
            size="sm-2"
            px={"40"}
            component={RdNavLink}
            to={`${newPatient}`}
          >
            Prescribe a New Patient
          </Button>
        </Stack>
      </div>
      <div className="card md:p-8 p-6 flex flex-col sm:flex-row  lg:gap-[110px] md:gap-16 gap-6">
        <div className="card-thumb flex justify-center sm:justify-start items-end flex-shrink-0">
          <Avatar
            src="/images/prescribe-existing.png"
            size="180px"
            radius="0"
          />
        </div>
        <Stack
          gap={0}
          className="items-center sm:items-start"
        >
          <h6 className="text-foreground mb-2">Prescribe an Existing Patient</h6>
          <p className="extra-form-text-regular text-center sm:text-left pb-2.5 max-w-[330px]">Quickly add a patient by searching through existing records.</p>
          <Button
            className="mt-0 sm:mt-auto"
            size="sm-2"
            px={"24"}
            component={RdNavLink}
            to={`${oldPatient}`}
          >
            Prescribe an Existing Patient
          </Button>
        </Stack>
      </div>
    </div>
  );
}

export default PrescribeCommonPage;
