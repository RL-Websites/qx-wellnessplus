import { IDoctor } from "@/common/api/models/interfaces/Doctor.model";
import { IProfileImageDto, IUserData } from "@/common/api/models/interfaces/User.model";
import userRepository from "@/common/api/repositories/userRepository";
import { userAtom } from "@/common/states/user.atom";
import ChangePasswordModal from "@/pages/admin-app/users/components/ChangePasswordModal";
import { formatPhoneNumber } from "@/utils/helper.utils";
import { getDoctorStatusTheme } from "@/utils/status.utils";
import { ActionIcon, Avatar, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai/react";
import ProfileImageCropper from "../../ProfileImageCropper";

interface IPrescriberPersonalInfo {
  prescriberDetails?: IDoctor;
  prescriberType: (type: string | undefined) => string;
  handleAction: (u_id: string | undefined, status: string) => void;
  isMyProfile?: boolean;
}

function PrescriberPersonalInfo({ prescriberDetails, prescriberType, handleAction, isMyProfile = false }: IPrescriberPersonalInfo) {
  const [openChangePassModal, changePassModalHandler] = useDisclosure();
  const [openImageCropper, ImageCropperModalHandler] = useDisclosure();
  const [userData, setUserDataAtom] = useAtom<IUserData | null>(userAtom);

  const profileImageMutation = useMutation({ mutationFn: (payload: IProfileImageDto) => userRepository.profileImageUpdate(payload) });

  const onCropped = (form: string | ArrayBuffer | null | File) => {
    const image = form;
    if (userData?.u_id) {
      const payload: IProfileImageDto = { u_id: userData?.u_id, profile_image: image };
      profileImageMutation.mutate(payload, {
        onSuccess: (res) => {
          if (res.data?.data?.user?.id) {
            setUserDataAtom(res?.data?.data?.user);
            ImageCropperModalHandler.close();
          }
        },
        onError: (err) => {
          console.log(err);
        },
      });
    }
  };
  return (
    <div className="dml-profile-content-inner">
      <div className="inner-title">
        <div className="flex items-center gap-2.5">
          <h6>Personal Information</h6>
          <span className="tags sm:w-20 w-14 bg-primary-light text-primary capitalize">{prescriberType(prescriberDetails?.type)}</span>
        </div>
        {!isMyProfile && (
          <Menu
            shadow="md"
            width={200}
            position={"bottom-end"}
          >
            <Menu.Target>
              <ActionIcon className="bg-transparent hover:bg-grey-low">
                <i className="icon-dot text-foreground"></i>
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              {prescriberDetails?.status == "accepted" || prescriberDetails?.status == "active" ? (
                <>
                  <Menu.Item
                    leftSection={<i className="icon-approve-doctor text-fs-md"></i>}
                    onClick={() => handleAction(prescriberDetails?.u_id, "inactive")}
                  >
                    Inactive
                  </Menu.Item>
                </>
              ) : (
                ""
              )}
              {prescriberDetails?.status == "inactive" && (
                <Menu.Item
                  leftSection={<i className="icon-checkbox-select text-fs-md"></i>}
                  onClick={() => handleAction(prescriberDetails?.u_id, "active")}
                >
                  Active
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
      <div className="inner-wrapper">
        <div className="inner-wrapper-thumb">
          <Avatar
            src={`${import.meta.env.VITE_BASE_PATH}/storage/${prescriberDetails?.userable?.profile_image}`}
            size={208}
            radius={10}
            className={`${isMyProfile ? "user-avatar" : ""}`}
            onClick={() => {
              if (isMyProfile) {
                ImageCropperModalHandler.open();
              } else {
                console.log("This profile is not editable.");
              }
            }}
          >
            <img
              src="/images/profile-blank.svg"
              alt=""
            />
          </Avatar>

          <ProfileImageCropper
            openModal={openImageCropper}
            onModalClose={ImageCropperModalHandler.close}
            src={`${import.meta.env.VITE_BASE_PATH}/storage/${prescriberDetails?.userable?.profile_image}`}
            cropped={onCropped}
            isLoading={profileImageMutation.isPending}
          />
        </div>
        <div className="inner-wrapper-text">
          <div className="wrapper-text-flex md:pr-10">
            <div className="text-name">
              <h6 className="text-secondary font-medium pb-2">Name</h6>

              <p className="text-grey-medium">{prescriberDetails?.name}</p>
            </div>
            <div className="text-email">
              <h6 className="text-secondary font-medium pb-2">Email Address</h6>
              <p className="text-grey-medium">{prescriberDetails?.email}</p>
            </div>
          </div>
          <div className="wrapper-text-flex md:pl-10">
            <div className="text-phone">
              <h6 className="text-secondary extra-form-text-medium pb-2">Phone/Mobile No</h6>
              <p className="text-grey-medium">{formatPhoneNumber(prescriberDetails?.phone)}</p>
            </div>

            {isMyProfile ? (
              <div className="text-avail">
                <h6 className="text-secondary extra-form-text-medium pb-4">Password</h6>
                <button
                  type="button"
                  className="text-primary text-fs-sm !font-medium underline"
                  onClick={() => changePassModalHandler.open()}
                >
                  Change Password
                </button>
              </div>
            ) : (
              <>
                <div className="text-avail">
                  <h6 className="text-secondary extra-form-text-medium pb-2">Status</h6>
                  <span className={`tags capitalize ${getDoctorStatusTheme(prescriberDetails?.status)}`}>{prescriberDetails?.status?.toLowerCase()}</span>
                </div>
              </>
            )}

            <ChangePasswordModal
              openModal={openChangePassModal}
              onModalClose={changePassModalHandler.close}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrescriberPersonalInfo;
