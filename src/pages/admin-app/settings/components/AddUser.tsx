import { IClientList } from "@/common/api/models/interfaces/client.model";
import { ICreateUserDto, IUserData } from "@/common/api/models/interfaces/User.model";
import authApiRepository from "@/common/api/repositories/authRepository";
import addClientApiRepository from "@/common/api/repositories/clientRepositoiry";
import userRepository from "@/common/api/repositories/userRepository";
import dmlToast from "@/common/configs/toaster.config";
import { Locations } from "@/common/constants/locations";
import { ILocation } from "@/common/models/location";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Modal, NumberInput, PasswordInput, Select, Skeleton } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// schema declaration with yup resolver
const addClientSchema = yup.object({
  first_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("First Name"),
  last_name: yup
    .string()
    // .required(({ label }) => `${label} is required`)
    .label("Last Name"),
  email: yup
    .string()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Please provide a valid email address")
    .email("Please enter a valid email address")
    .required(({ label }) => `${label} is required`)
    .label("Email"),
  phone: yup
    .string()
    // .required(({ label }) => `${label} is required`)
    // .length(10, "Mobile number must be 10 digits")
    .label("Mobile Number"),
  address: yup
    .string()
    // .required("Address is required")
    // .min(5, "Address must be at least 5 characters long")
    .label("Address"),
  state_id: yup
    .string()
    // .required("Please select a state")
    .label("State"),
  city_id: yup
    .string()
    // .required("Please select a city")
    .label("City"),
  zip_code: yup
    .string()
    // .required(({ label }) => `${label} is required`)
    .label("Zip code"),
  password: yup
    .string()
    .required("You need to provide a password")
    .min(8, "Password must have at least 8 characters")
    .matches(/^(?=.*\d).*$/, "Password must contain at least one numerical value")
    .matches(/^((?=.*[a-z]){1}).*$/, "Password must contain at least one lower case alphabetical character")
    .matches(/^((?=.*[A-Z]){1}).*$/, "Password must contain at least one upper case alphabetical character")
    .matches(/^(?=.*[!@#$%^&()\-+=\{\};:,<.>]).*$/, "Password must contain at least one special character")
    .label("Password"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("You need to confirm your Password"),
  userable_type: yup.string().required("Please select a role").label("Role"),
  // client_id: yup.string().when("userable_type", (userable_type, schema) => {
  //   return userable_type == "client_admin" ? schema.required("Please select a client") : schema
  // }),
  client_id: yup.string().when("userable_type", {
    is: (value) => value === "client_admin",
    then: (schema) => schema.required("Please select a client"),
  }),
});

const addClientSchema2 = yup.object({
  first_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("First Name"),
  last_name: yup
    .string()
    // .required(({ label }) => `${label} is required`)
    .label("Last Name"),
  email: yup
    .string()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Please provide a valid email address")
    .email("Please enter a valid email address")
    .required(({ label }) => `${label} is required`)
    .label("Email"),
  phone: yup
    .string()
    // .required(({ label }) => `${label} is required`)
    // .length(10, "Mobile number must be 10 digits")
    .label("Mobile Number"),
  address: yup
    .string()
    // .required("Address is required")
    // .min(5, "Address must be at least 5 characters long")
    .label("Address"),
  state_id: yup
    .string()
    // .required("Please select a state")
    .label("State"),
  city_id: yup
    .string()
    // .required("Please select a city")
    .label("City"),
  zip_code: yup
    .string()
    // .required(({ label }) => `${label} is required`)
    .label("Zip code"),
  userable_type: yup.string().required("Please select a role").label("Role"),
  // client_id: yup.string().when("userable_type", (userable_type, schema) => {
  //   return userable_type == "client_admin" ? schema.required("Please select a client") : schema
  // }),
  client_id: yup.string().when("userable_type", {
    is: (value) => value === "client_admin",
    then: (schema) => schema.required("Please select a client"),
  }),
});

type AddClientSchemaType = yup.InferType<typeof addClientSchema>;
type AddClientSchemaType2 = yup.InferType<typeof addClientSchema2>;

interface IAddUserProps {
  locations?: Array<object>;
  formData?: any;
  openModal: boolean;
  isEditing?: boolean;
  user_u_id?: string;
  onModalClose: (reason?: string) => void;
}

function AddUser({ openModal, onModalClose, isEditing = false, user_u_id }: IAddUserProps) {
  const [isAvailable, setIsAvailable] = useState(1);
  const [states, setStates] = useState<ILocation[]>([]);
  const [cities, setCities] = useState<ILocation[]>([]);
  const [city, setCity] = useState<string>("");
  const [cityVal, setCityVal] = useState<string>("");
  const [stateVal, setStateVal] = useState<string>("");
  const [phoneVal, setPhoneVal] = useState<string>("");
  const [role, setRole] = useState("");
  const [client, setClient] = useState("");

  const [zipCode, setZipCode] = useState<number | string>("");
  const [userDetails, setUserDetails] = useState<IUserData | null>();
  const [callUserDetails, setCallUserDetails] = useState<boolean>(false);

  const [clientList, setClientList] = useState<IClientList[]>([]);

  useEffect(() => {
    setStates(Locations.filter((item) => item.type.toLowerCase() == "state"));
  }, []);

  const modalDismiss = () => {
    reset();
    clearErrors();
    setUserDetails(null);
    setCallUserDetails(false);
    onModalClose();
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<AddClientSchemaType | AddClientSchemaType2>({
    resolver: yupResolver(isEditing ? addClientSchema2 : addClientSchema),
  });

  useEffect(() => {
    if (openModal && user_u_id && isEditing) {
      setCallUserDetails(true);
    }
  }, [isEditing, openModal, user_u_id]);

  const userDetailsQuery = useQuery({
    queryKey: [callUserDetails],
    queryFn: () => authApiRepository.getUserDetails(user_u_id),
    enabled: !!callUserDetails,
  });

  useEffect(() => {
    if (userDetailsQuery?.data?.data?.status_code == 200 && userDetailsQuery?.data?.data?.data && states?.length) {
      console.log(userDetailsQuery?.data?.data?.data);
      setUserDetails(userDetailsQuery?.data?.data?.data);
      const userData = userDetailsQuery?.data?.data?.data;
      reset({
        first_name: userData?.first_name,
        last_name: userData?.last_name,
        email: userData?.email,
        address: userData?.addressable?.address1,
        userable_type: userData?.userable_type,
      });

      userData?.is_active != undefined ? setIsAvailable(userData?.is_active) : "";
      userData?.userable_type ? setRole(userData?.userable_type) : "";
      // userData?.client_name ? setRole(userData?.client_name) : "";
      userData?.phone ? setPhoneVal(userData?.phone) : "";
      userData?.addressable?.zip_code ? setZipCode(userData?.addressable.zip_code) : "";
      if (userData?.userable_type == "client_admin" && userData?.client?.id) {
        setClient(userData?.client?.id?.toString());
        setValue("client_id", userData?.client?.id?.toString());
      }

      if (Locations?.length && userData?.addressable?.state_id && userData?.addressable?.city_id) {
        setValue("state_id", userData?.addressable?.state_id?.toString() || "");
        setStateVal(userData?.addressable?.state_id?.toString() || "");
        setCities(Locations.filter((item) => item.parent_id == userData?.addressable?.state_id));
        setValue("city_id", userData?.addressable?.city_id?.toString() || "");
        setCityVal(userData?.addressable?.city_id?.toString() || "");
      }
    }
  }, [userDetailsQuery?.isFetched, userDetailsQuery?.data, states]);

  const clientListQueryFn = () => {
    const params = {
      paginate: false,
      sort_column: "id",
      sort_direction: "desc",
    };
    return addClientApiRepository.getClients(params);
  };

  const clientsQuery = useQuery({ queryKey: ["clientDDList"], queryFn: clientListQueryFn });

  useEffect(() => {
    if (clientsQuery.isFetched) {
      if (clientsQuery?.data?.status == 200) {
        setClientList(clientsQuery.data?.data?.data?.data || []);
      }
    }
  }, [clientsQuery.isFetched, clientsQuery.data]);

  const addUserMutation = useMutation({ mutationFn: (payload: ICreateUserDto) => userRepository.createUser(payload) });

  const updateUserMutation = useMutation({ mutationFn: (payload: ICreateUserDto) => userRepository.userSettingInfoUpdate(payload) });

  const onSubmit = (data: AddClientSchemaType) => {
    const payload: ICreateUserDto = {
      ...data,
      is_active: isAvailable,
    };

    if (!isEditing) {
      addUserMutation.mutate(payload, {
        onSuccess: () => {
          dmlToast.success({
            title: "User added successfully",
          });
          reset();
          clearErrors();
          onModalClose("success");
        },
        onError: (error) => {
          dmlToast.error({
            message: getErrorMessage(error),
            title: "Error adding user",
          });
        },
      });
    } else {
      const { email, password, confirm_password, ...rest } = payload;
      const editPayload = { ...rest, _method: "put", u_id: user_u_id };
      updateUserMutation.mutate(editPayload, {
        onSuccess: () => {
          dmlToast.success({
            title: "User updated successfully",
          });
          reset();
          clearErrors();
          setUserDetails(null);
          onModalClose("success");
        },
        onError: (error) => {
          dmlToast.error({
            message: getErrorMessage(error),
            title: "Error adding user",
          });
        },
      });
    }
  };

  return (
    <Modal.Root
      opened={openModal}
      onClose={modalDismiss}
      closeOnClickOutside={false}
      centered
      size="1237px"
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{isEditing ? "Update User" : "Add New User"}</Modal.Title>
          <div className="flex items-center">
            {userDetailsQuery?.isFetching ? (
              ""
            ) : (
              <div className="flex items-center gap-3">
                <label
                  htmlFor="availability"
                  className="text-foreground text-fs-sp"
                >
                  User Status
                </label>
                <label className="custom-switch">
                  <input
                    id="availability"
                    type="checkbox"
                    checked={Boolean(isAvailable)}
                    onChange={(e) => setIsAvailable(e.target.checked ? 1 : 0)}
                  />
                  <span className="custom-switch-slider" />
                </label>
              </div>
            )}

            {/* <ActionIcon
              onClick={closeModal}
              radius="100%"
              bg="dark"
              size="20"
            >
              <i className="icon-cross1 text-xs"></i>
            </ActionIcon> */}
            <i
              onClick={modalDismiss}
              className="icon-cross text-2xl/none cursor-pointer ml-6"
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <form
            className="rounded-md mx-auto flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-2 gap-y-4 gap-x-7">
              <Input.Wrapper
                label="First Name"
                withAsterisk
                error={errors.first_name?.message ? errors.first_name?.message : false}
              >
                <Input
                  {...register("first_name")}
                  error={Boolean(errors.first_name?.message)}
                />
                {userDetailsQuery?.isFetching ? <Skeleton height={56} /> : ""}
              </Input.Wrapper>
              <Input.Wrapper
                label="Last Name"
                // withAsterisk
                // error={errors.last_name?.message ? errors.last_name?.message : false}
              >
                <Input
                  {...register("last_name")}
                  // error={Boolean(errors.last_name?.message)}
                />
                {userDetailsQuery?.isFetching ? <Skeleton height={56} /> : ""}
              </Input.Wrapper>
              <Input.Wrapper
                label="Email"
                error={errors.email?.message ? errors.email?.message : false}
                withAsterisk
              >
                <Input
                  {...register("email")}
                  error={Boolean(errors.email?.message)}
                  disabled={isEditing}
                />
                {userDetailsQuery?.isFetching ? <Skeleton height={56} /> : ""}
              </Input.Wrapper>
              <div className="relative">
                <NumberInput
                  {...register("phone")}
                  value={phoneVal}
                  onChange={(value) => {
                    setPhoneVal(value.toString());
                    if (value) {
                      setValue("phone", value?.toString(), { shouldValidate: true });
                    }
                  }}
                  label="Mobile Number"
                  // withAsterisk
                  // error={errors.phone?.message ? errors.phone?.message : false}
                  max={9999999999}
                  min={0}
                  hideControls
                  clampBehavior="strict"
                  allowDecimal={false}
                  allowNegative={false}
                />
                {userDetailsQuery?.isFetching ? (
                  <Skeleton
                    className="absolute bottom-0 left-0"
                    height={56}
                  />
                ) : (
                  ""
                )}
              </div>

              <Input.Wrapper
                className="w-full"
                label="Address"
                // error={errors.address?.message ? errors.address?.message : false}
                // withAsterisk
              >
                <Input
                  type="text"
                  {...register("address")}
                  // error={Boolean(errors?.address?.message)}
                />
                {userDetailsQuery?.isFetching ? <Skeleton height={56} /> : ""}
              </Input.Wrapper>
              <div className="relative">
                <Select
                  label="State"
                  // withAsterisk
                  {...register("state_id")}
                  rightSection={<i className="icon-down-arrow text-sm"></i>}
                  // error={getErrorMessage(errors.state_id)}
                  value={stateVal}
                  searchable
                  data={states?.map((item) => ({ value: item?.id?.toString(), label: item?.name || "" }))}
                  onChange={(value: any) => {
                    setStateVal(value);
                    setValue("state_id", value || "", { shouldValidate: true });
                    setCities(Locations.filter((item) => item.parent_id == value));

                    setCity("");
                  }}
                />

                {userDetailsQuery?.isFetching ? (
                  <Skeleton
                    className="absolute bottom-0 left-0"
                    height={56}
                  />
                ) : (
                  ""
                )}
              </div>

              <div className="relative">
                <Select
                  label="City"
                  // withAsterisk
                  {...register("city_id")}
                  rightSection={<i className="icon-down-arrow text-sm"></i>}
                  // error={getErrorMessage(errors.city_id)}
                  value={cityVal}
                  searchable
                  searchValue={city}
                  onSearchChange={setCity}
                  data={cities?.map((item) => ({ value: item?.id?.toString(), label: item?.name || "" }))}
                  onChange={(value: any) => {
                    setCityVal(value);
                    setValue("city_id", value || "", { shouldValidate: true });
                  }}
                />
                {userDetailsQuery?.isFetching ? (
                  <Skeleton
                    className="absolute bottom-0 left-0"
                    height={56}
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="relative">
                <NumberInput
                  className="w-full"
                  {...register("zip_code")}
                  value={zipCode}
                  onChange={(value) => {
                    if (value) {
                      setValue("zip_code", value.toString());
                      clearErrors("zip_code");
                    }
                    setZipCode(value?.toString());
                  }}
                  label="Zip Code"
                  // withAsterisk
                  // error={getErrorMessage(errors.zip_code)}
                  max={9999999999}
                  min={0}
                  hideControls
                  clampBehavior="strict"
                  allowNegative={false}
                />
                {userDetailsQuery?.isFetching ? (
                  <Skeleton
                    className="absolute bottom-0 left-0"
                    height={56}
                  />
                ) : (
                  ""
                )}
              </div>

              {/* <Input
                  {...register("zip_code")}
                  error={Boolean(errors.zip_code?.message)}
                /> */}

              {isEditing ? (
                ""
              ) : (
                <>
                  <Input.Wrapper
                    label="Password"
                    required
                    error={getErrorMessage(errors?.password)}
                  >
                    <PasswordInput
                      {...register("password")}
                      visibilityToggleIcon={({ reveal }) =>
                        reveal ? <i className="icon-view text-2xl leading-none"></i> : <i className="icon-view-off text-2xl leading-none"></i>
                      }
                      classNames={{
                        input: errors?.password?.message ? "!border-1 !border-danger" : "",
                      }}
                    />
                    {userDetailsQuery?.isFetching ? <Skeleton height={56} /> : ""}
                  </Input.Wrapper>
                  <Input.Wrapper
                    label="Confirm Password"
                    required
                    error={getErrorMessage(errors?.confirm_password)}
                  >
                    <PasswordInput
                      {...register("confirm_password")}
                      visibilityToggleIcon={({ reveal }) =>
                        reveal ? <i className="icon-view text-2xl leading-none"></i> : <i className="icon-view-off text-2xl leading-none"></i>
                      }
                      classNames={{
                        input: errors?.confirm_password?.message ? "!border-1 !border-danger" : "",
                      }}
                    />
                    {userDetailsQuery?.isFetching ? <Skeleton height={56} /> : ""}
                  </Input.Wrapper>
                </>
              )}

              <div className="relative">
                <Select
                  label="Select Role"
                  withAsterisk
                  error={getErrorMessage(errors.userable_type)}
                  {...register("userable_type")}
                  rightSection={<i className="icon-down-arrow text-sm"></i>}
                  searchable
                  className="w-full"
                  value={role}
                  data={[
                    { value: "admin", label: "Admin" },
                    { value: "standard", label: "Standard" },
                    { value: "client_admin", label: "Client Admin" },
                  ]}
                  onChange={(value: any) => {
                    setValue("userable_type", value || "", { shouldValidate: true });
                    setRole(value);
                  }}
                />
                {userDetailsQuery?.isFetching ? (
                  <Skeleton
                    className="absolute bottom-0 left-0"
                    height={56}
                  />
                ) : (
                  ""
                )}
              </div>

              {getValues("userable_type") == "client_admin" ? (
                <>
                  <div className="relative">
                    <Select
                      label="Select Client"
                      withAsterisk
                      classNames={{
                        wrapper: "bg-grey-btn rounded-md",
                      }}
                      error={getErrorMessage(errors.client_id)}
                      {...register("client_id")}
                      rightSection={<i className="icon-down-arrow text-sm"></i>}
                      searchable
                      className="w-full"
                      value={client}
                      data={clientList?.map((item) => ({ value: item?.id?.toString(), label: item?.name }))}
                      onChange={(value: any) => {
                        setValue("client_id", value || "", { shouldValidate: true });
                        setClient(value);
                      }}
                    />
                    {userDetailsQuery?.isFetching ? (
                      <Skeleton
                        className="absolute bottom-0 left-0"
                        height={56}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            <Button
              type="submit"
              variant="filled"
              mt={24}
              className="dml-modal-btn"
              loading={addUserMutation.isPending || updateUserMutation.isPending}
            >
              {isEditing ? "Update User" : "Add User"}
            </Button>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default AddUser;
