import { Box, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const LoadingPage = () => {
  const [visible, { toggle }] = useDisclosure(true);
  return (
    <div className="lg:pt-16 md:pt-10 pt-4">
      <h2 className="heading-text  text-foreground uppercase  text-center">Preparing your account...</h2>
      <Box pos="relative">
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{
            radius: "sm",
            blur: 2,
            bg: "rgba(0, 0, 0, 0)",
          }}
          loaderProps={{ color: "primary", type: "bars", size: 100 }}
        />
        <div className="h-20 w-20 mt-20 bg-transparent"></div>
      </Box>

      {/* <Group justify="center">
        <Button onClick={toggle}>Toggle overlay</Button>
      </Group> */}
    </div>
  );
};

export default LoadingPage;
