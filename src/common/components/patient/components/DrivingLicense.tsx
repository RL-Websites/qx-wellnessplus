import { Image } from "@mantine/core";

interface DrivingLicensePropTypes {
  frontImg?: string;
  backImg?: string;
}

export const DrivingLicense = ({ frontImg, backImg }: DrivingLicensePropTypes) => {
  return (
    <>
      <div className="card-title mt-5">
        <h6>Driving License</h6>
      </div>
      <div className="max-w-[716px] w-full xl:grid grid-cols-2 gap-4 pt-5">
        {frontImg ? <Image src={`${import.meta.env.VITE_BASE_PATH}/storage/test_files/${frontImg}`} /> : ""}

        {backImg ? <Image src={`${import.meta.env.VITE_BASE_PATH}/storage/test_files/${backImg}`} /> : ""}
      </div>
    </>
  );
};
