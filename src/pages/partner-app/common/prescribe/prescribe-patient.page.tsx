import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import { Avatar, Button, Stack } from "@mantine/core";
import { NavLink as RdNavLink } from "react-router-dom";

function PrescribePatientPage() {
  const menuItems = [
    {
      title: "Patients",
      href: "/partner/patients",
    },
    {
      title: "Add Patient",
    },
  ];

  return (
    <>
      <div className="page-title">
        <h6 className="lg:h2 md:h3 sm:h4">Patients</h6>
      </div>
      <DynamicBreadcrumbs
        items={menuItems}
        separatorMargin="1"
      />
      {/* <PrescribeCommonPage
        newPatient="new-patient"
        oldPatient="existing-patient"
      /> */}

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
            <h6 className="text-foreground mb-2">Sell to New Client</h6>
            <p className="extra-form-text-regular text-center sm:text-left pb-2.5 max-w-[330px]">Quickly register and sell to a new client in just a few steps.</p>
            <Button
              className="mt-0 sm:mt-auto"
              size="sm-2"
              px={"40"}
              component={RdNavLink}
              to="new-patient"
            >
              Sell to New Client
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
            <h6 className="text-foreground mb-2">Sell to Existing Client</h6>
            <p className="extra-form-text-regular text-center sm:text-left pb-2.5 max-w-[330px]">Search existing records and complete a sale quickly.</p>
            <Button
              className="mt-0 sm:mt-auto"
              size="sm-2"
              px={"24"}
              component={RdNavLink}
              to="existing-patient"
            >
              Sell to Existing Client
            </Button>
          </Stack>
        </div>
      </div>
    </>
  );
}

export default PrescribePatientPage;
