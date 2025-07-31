import { Button, Image, Stack } from "@mantine/core";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  return (
    <>
      <div className="page-title mb-5">
        <h2>Settings</h2>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="flex flex-col sm:flex-row bg-white rounded-xl">
          <div className="card-thumb flex justify-center sm:justify-start items-end flex-shrink-0">
            <Image src="/images/add-user.png" />
          </div>
          <Stack
            gap={0}
            className="pl-5 sm:pl-0 sm:ms-5 pt-4.5 pb-2.5 pr-5 items-center sm:items-start"
          >
            <h6 className="text-foreground mb-2">User List</h6>
            <p className="extra-form-text-regular text-center sm:text-left">
              You can add a new user and assign a role to them. You can assign a different role to an existing user.
            </p>
            <Button
              className="mt-2.5 sm:mt-auto"
              size="sm-2"
              w={220}
              component={Link}
              to="user-list"
            >
              View Details
            </Button>
          </Stack>
        </div>
        {/* <div className="flex flex-col sm:flex-row bg-white  rounded-xl">
          <div className="card-thumb flex justify-center sm:justify-start items-end flex-shrink-0">
            <Image src="/images/add-icd-cpt.png" />
          </div>
          <Stack
            gap={0}
            className="pl-5 sm:pl-0 sm:ms-5 pt-4.5 pb-2.5 pr-5 items-center sm:items-start"
          >
            <h6 className="text-foreground mb-2">ICD & CPT Codes</h6>
            <p className="extra-form-text-regular text-center sm:text-left">
              You can add ICD codes and CPT codes here. You can also edit those here.
            </p>
            <Button
              className="mt-2.5 sm:mt-auto"
              size="sm-2"
              w={220}
              component={Link}
              to="./icd-codes"
            >
              View Details
            </Button>
          </Stack>
        </div> */}
        {/* <div className="flex flex-col sm:flex-row bg-white  rounded-xl">
          <div className="card-thumb flex justify-center sm:justify-start items-end flex-shrink-0">
            <Image src="/images/received-api-logs.png" />
          </div>
          <Stack
            gap={0}
            className="pl-5 sm:pl-0 sm:ms-5 pt-4.5 pb-2.5 pr-5 items-center sm:items-start"
          >
            <h6 className="text-foreground mb-2">Received API Logs</h6>
            <p className="extra-form-text-regular text-center sm:text-left">You can access and review API logs in the "Received API Log" page.</p>
            <Button
              className="mt-2.5 sm:mt-auto"
              size="sm-2"
              w={220}
              component={Link}
              to="received-api-logs"
            >
              View Details
            </Button>
          </Stack>
        </div> */}
      </div>
    </>
  );
};

export default SettingsPage;
