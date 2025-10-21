import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
// import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "./assets/css/styles.css";

import { LoadingOverlay, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { cssResolver } from "./common/configs/mantine-css-resolver";
import { theme } from "./common/configs/mantine-theme-config";
import AuthContextProvider from "./context/AuthContextProvider";
import { RootRoute } from "./root.route";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable auto-refetching on window focus
    },
  },
});

function RootApp() {
  // return (
  //   <QueryClientProvider client={queryClient}>
  //     <MantineProvider
  //       withCssVariables
  //       withGlobalClasses
  //       classNamesPrefix="dml"
  //       theme={theme}
  //       cssVariablesResolver={cssResolver}
  //     >
  //       <Notifications />
  //       <RootUserResolver>
  //         <RouterProvider router={RootRoute} />
  //       </RootUserResolver>
  //     </MantineProvider>
  //   </QueryClientProvider>
  // );

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withCssVariables
        withGlobalClasses
        classNamesPrefix="dml"
        theme={theme}
        cssVariablesResolver={cssResolver}
      >
        <Notifications position="top-center" />
        <AuthContextProvider>
          <Suspense
            fallback={
              <LoadingOverlay
                visible={true}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 1 }}
                loaderProps={{ color: "primary", type: "bars" }}
              />
            }
          >
            <RouterProvider router={RootRoute} />
          </Suspense>
        </AuthContextProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default RootApp;
