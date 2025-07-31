import { IProfileImageDto, IUserData } from "@/common/api/models/interfaces/User.model";
import userRepository from "@/common/api/repositories/userRepository";
import ProfileImageCropper from "@/common/components/ProfileImageCropper";
import { userAtom } from "@/common/states/user.atom";
import ChangePasswordModal from "@/pages/admin-app/users/components/ChangePasswordModal";
import { formatPhoneNumber } from "@/utils/helper.utils";
import { ActionIcon, Avatar, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai/react";

interface IClientPersonalInfo {
  clinicName?: string;
  isMyProfile?: boolean;
  getProfileImagePath?: any;
  clientDetails?: IUserData | any;
  associatedClient?: boolean;
  soldQty?: boolean;
  onStatusUpdate: (slug: string, newStatus: string) => void;
}

function ClientPersonalInfo({ isMyProfile, associatedClient, clientDetails, onStatusUpdate, soldQty, getProfileImagePath }: IClientPersonalInfo) {
  const [openChangePassModal, changePassModalHandler] = useDisclosure();
  const [openImageCropper, ImageCropperModalHandler] = useDisclosure();
  const [userData, setUserDataAtom] = useAtom<IUserData | null>(userAtom);

  const getStatusClassName = (status: string) => {
    switch (status) {
      case "invited":
        return "bg-yellow-light text-yellow-deep";
      case "active":
        return "bg-green-low text-green-middle";
      case "inactive":
        return "bg-danger-light text-danger-deep";
      case "pending":
        return "bg-tag-bg text-tag-bg-deep";
      default:
        return "";
    }
  };

  const { status, slug: slug } = clientDetails || {};

  const handleStatusUpdate = (slug: string, newStatus: string) => {
    if (slug && onStatusUpdate) {
      onStatusUpdate(slug, newStatus);
    }
  };

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
          {status == undefined ? (
            ""
          ) : (
            <span className={`tags ${getStatusClassName(status)}`}>
              {status === "invited" ? "Invited" : status === "active" ? "Active" : status === "inactive" ? "Inactive" : status === "pending" ? "Pending" : ""}
            </span>
          )}
        </div>

        {isMyProfile ? (
          ""
        ) : (
          <>
            {status === "invited" || status === "pending" ? (
              ""
            ) : (
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
                  {status === "active" && (
                    <Menu.Item
                      leftSection={<i className="icon-approve-doctor text-fs-md"></i>}
                      className="leading-tight"
                      onClick={() => handleStatusUpdate(slug, "inactive")}
                    >
                      Inactive
                    </Menu.Item>
                  )}
                  {status === "inactive" && (
                    <Menu.Item
                      leftSection={<i className="icon-approve-doctor text-fs-md"></i>}
                      className="leading-tight"
                      onClick={() => handleStatusUpdate(slug, "active")}
                    >
                      Active
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            )}
          </>
        )}
      </div>
      <div className="inner-wrapper">
        <div className="inner-wrapper-thumb">
          <Avatar
            src={`${import.meta.env.VITE_BASE_PATH}/storage/${clientDetails?.profile_image}` || "/images/clinic-logo-blank.jpg"}
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
            src={`${import.meta.env.VITE_BASE_PATH}/storage/${clientDetails?.logo}`}
            cropped={onCropped}
            isLoading={profileImageMutation.isPending}
          />
        </div>
        <div className="inner-wrapper-text">
          <div className="wrapper-text-flex md:pr-10">
            <div className="text-name">
              <h6 className="text-secondary font-medium pb-2">Name</h6>
              <p className="text-grey-medium">{clientDetails?.type === "client" ? clientDetails?.name : clientDetails?.full_name}</p>
            </div>
            <div className="text-email">
              <h6 className="text-secondary font-medium pb-2">Email Address</h6>
              <p className="text-grey-medium">{clientDetails?.email}</p>
            </div>
            <div className="text-medicine">
              <h6 className="text-secondary extra-form-text-medium pb-2">Total Medicine Sold</h6>
              <p className="text-grey-medium">{clientDetails?.prescription_count}</p>
            </div>
          </div>
          <div className="wrapper-text-flex md:pl-10">
            <div className="text-phone">
              <h6 className="text-secondary extra-form-text-medium pb-2">Phone/Mobile No</h6>
              <p className="text-grey-medium">{formatPhoneNumber(clientDetails?.phone)}</p>
            </div>
            <div className="text-phone">
              <h6 className="text-secondary extra-form-text-medium pb-2">Fax Number</h6>
              <p className="text-grey-medium">{formatPhoneNumber(clientDetails?.fax)}</p>
            </div>

            {associatedClient && (
              <div className="text-client">
                <h6 className="text-secondary extra-form-text-medium pb-2">Associated Client</h6>
                <p className="text-grey-medium">{clientDetails?.client?.name}</p>
              </div>
            )}

            {/* {soldQty && (
              <div className="text-client">
                <h6 className="text-secondary extra-form-text-medium pb-2">Sold Qty</h6>
                <p className="text-grey-medium">{"0"}</p>
              </div>
            )} */}

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
                {/* <div className="text-avail">
                <h6 className="text-secondary extra-form-text-medium pb-2">Status</h6>
                <span className={`tags ${getStatusClassName(clientDetails?.status)}`}>{clientDetails?.status}</span>
              </div> */}
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

export default ClientPersonalInfo;
