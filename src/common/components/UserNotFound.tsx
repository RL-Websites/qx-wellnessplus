import { Button } from "@mantine/core";
import { IconArrowLeft, IconMoodEmpty } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const UserNotFoundPage = () => {
  return (
    <section className="bg-white">
      <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="p-3 text-sm font-medium ">
            <IconMoodEmpty size={55} />
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-neutral-primary md:text-3xl">User not found</h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            The user you are trying to login doesn't have proper data on the server. Please contact the administrator to enable your account.
          </p>
          <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            <Button
              leftSection={<IconArrowLeft />}
              component={Link}
              to={"/login"}
            >
              Take me home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserNotFoundPage;
