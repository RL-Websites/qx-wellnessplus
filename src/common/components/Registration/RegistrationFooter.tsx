import { Text } from "@mantine/core";

const RegistrationFooter = () => {
  const year = new Date().getFullYear();
  return (
    <div className="bg-white py-5  mt-auto">
      <div className="dr-header-container  ">
        <Text className="text-fs-xs text-center">Copyright &copy; {year} Wellness Plus. All rights reserved.</Text>
      </div>
    </div>
  );
};

export default RegistrationFooter;
