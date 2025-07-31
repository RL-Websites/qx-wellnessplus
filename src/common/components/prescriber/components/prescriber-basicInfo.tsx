import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IDoctor, IDoctorBasicInfoDTO } from "@/common/api/models/interfaces/Doctor.model";
import { IUserData } from "@/common/api/models/interfaces/User.model";
import commonApiRepository from "@/common/api/repositories/commonApiRepository";
import doctorApiRepository from "@/common/api/repositories/doctorRepository";
import dmlToast from "@/common/configs/toaster.config";
import { Locations } from "@/common/constants/locations";
import { userAtom } from "@/common/states/user.atom";
import { formatDate } from "@/utils/date.utils";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Input, Loader, NumberInput, Select, Table } from "@mantine/core";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BaseProvider, LightTheme } from "baseui";
import { Datepicker as UberDatePicker } from "baseui/datepicker";
import { useAtom } from "jotai/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import * as yup from "yup";
import AddressAutoGoogle from "../../AddressAutoGoogle";

interface IPrescriberBasicInfo {
  prescriberDetails?: IDoctor;
  isEditable?: boolean;
  shouldEditEmail?: boolean;
  onUpdate?: (success: boolean) => void;
}

const prescriberBasicInfoSchema = yup.object({
  firstName: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("First Name"),
  lastName: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Last Name"),
  shouldEditEmail: yup.boolean(),
  email: yup.string().when("shouldEditEmail", {
    is: true,
    then: (schema) =>
      schema
        .email("Please provide a valid email address")
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Please provide a valid email address")
        .required(({ label }) => `${label} is required`)
        .label("Email address"),
  }),
  phone: yup
    .string()
    .min(10)
    .required(({ label }) => `${label} is required`)
    .label("Phone Number"),
  dob: yup
    .array(yup.string().nonNullable(() => "Please provide a valid date of format MM/DD/YYYY."))
    .typeError("Please provide a valid date of format MM/DD/YYYY.")
    .required("Please provide your date of birth"),
  country: yup.string().label("Country"),
  address: yup.string().required("Address is required").min(5, "Address must be at least 5 characters long"),

  state: yup.string().required("Please select a state").label("State"),
  city: yup.string().required("Please select a city").label("City"),
  stateLic: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("State LIC "),
  zipCode: yup.string().required().typeError("Zip code is required").label("Zip Code"),
  npi: yup.string().required().typeError("Npi is required").label("Npi"),
  npiUnique: yup.string(),
});

type PrescriberSchemaType = yup.InferType<typeof prescriberBasicInfoSchema>;

function PrescriberBasicInfo({ prescriberDetails, isEditable, onUpdate, shouldEditEmail = false }: IPrescriberBasicInfo) {
  const [basicInfoEditing, basicInfoEditHandler] = useDisclosure();
  const [userData, setUserDataAtom] = useAtom<IUserData | null>(userAtom);
  const engine = new Styletron();
  const [dob, setDob] = useState<any>(null);

  const [locations, setLocations] = useState<Array<object> | any>([]);
  const [zipCode, setZipcode] = useState<number | string>("");
  const [states, setStates] = useState<Array<object>>(Locations.filter((item: any) => item?.type.toLowerCase() == "state"));
  const [state, setState] = useState<string>();
  const [address, setAddress] = useState<string>();
  // const [cities, setCities] = useState<Array<object>>([]);
  // const [citySearchVal, setCitySearchVal] = useState("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [npi, setNpi] = useState<any>(null);
  const [npiChecking, setNpiChecking] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
  } = useForm({
    resolver: yupResolver(prescriberBasicInfoSchema),
    defaultValues: {
      country: "1",
    },
  });

  useEffect(() => {
    if (shouldEditEmail) {
      setValue("shouldEditEmail", true);
    } else {
      setValue("shouldEditEmail", false);
    }
  }, [shouldEditEmail]);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const minDate = new Date("1920-01-01");

  const locationQuery = useQuery({ queryKey: ["locationData"], queryFn: () => commonApiRepository.getLocations() });

  const basicInfoMutation = useMutation({
    mutationFn: (payload: IDoctorBasicInfoDTO) => doctorApiRepository.doctorDetailsUpdate(prescriberDetails?.u_id, payload),
  });

  const basicInfoSubmit = (data: PrescriberSchemaType) => {
    const payload: IDoctorBasicInfoDTO = {
      first_name: data?.firstName || "",
      last_name: data?.lastName || "",
      email: data?.email || "",
      dob: formatDate(data?.dob?.[0], "MM-DD-YYYY") || "",
      phone: data?.phone || "",
      address: data?.address || "",
      state: data?.state || "",
      city: data?.city || "",
      state_lic: data?.stateLic,
      zip_code: data?.zipCode || "",
      npi: data?.npi || "",
      type: "basic",
    };

    basicInfoMutation.mutate(payload, {
      onSuccess: (res) => {
        if (res?.data?.data?.name) {
          const tempUserData = { ...userData } as IUserData;
          if (tempUserData && tempUserData?.name) {
            tempUserData.name = res?.data?.data?.name;
            setUserDataAtom(tempUserData);
          }
          basicInfoEditHandler.close();
        }
        onUpdate?.(true);
        dmlToast.success({
          title: "Basic information updated successfully",
        });
      },
      onError: (error) => {
        const err = error as AxiosError<IServerErrorResponse>;
        dmlToast.error({
          title: err?.response?.data?.message,
        });
      },
    });
  };

  const basicInfoError = (err) => {
    console.log(err);
  };

  useEffect(() => {
    if (locationQuery.isFetched) {
      setLocations(locationQuery?.data?.data?.data);
    }
  }, [locationQuery]);

  useEffect(() => {
    if (prescriberDetails?.addressable?.zip_code) {
      setZipcode(prescriberDetails?.addressable?.zip_code);
      setValue("zipCode", prescriberDetails?.addressable?.zip_code ? prescriberDetails?.addressable?.zip_code?.toString() : "");
    }
  }, [prescriberDetails]);

  useEffect(() => {
    if (prescriberDetails?.dob) {
      const parsedDate = new Date(prescriberDetails.dob);
      setDob([parsedDate]);
      setValue("dob", [prescriberDetails.dob]);
    }
    setValue("firstName", prescriberDetails?.first_name || "", { shouldValidate: true });
    setValue("lastName", prescriberDetails?.last_name || "", { shouldValidate: true });
    setValue("email", prescriberDetails?.email || "", { shouldValidate: true });
    setValue("phone", prescriberDetails?.phone || "", { shouldValidate: true });
    setValue("country", "1", { shouldValidate: true });
    setValue("address", prescriberDetails?.addressable?.address1 || "", { shouldValidate: true });
    setAddress(prescriberDetails?.addressable?.address1);
    setValue("state", prescriberDetails?.addressable?.state ? prescriberDetails?.addressable?.state : "", { shouldValidate: true });
    setValue("city", prescriberDetails?.addressable?.city ? prescriberDetails?.addressable?.city : "", { shouldValidate: true });
    // setCitySearchVal(getLocName(prescriberDetails?.addressable?.city));
    setValue("stateLic", prescriberDetails?.state_lic ? prescriberDetails?.state_lic?.toString() : "", { shouldValidate: true });
    setValue("zipCode", prescriberDetails?.addressable?.zip_code ? prescriberDetails?.addressable?.zip_code?.toString() : "", {
      shouldValidate: true,
    });
    setValue("npi", prescriberDetails?.npi ? prescriberDetails?.npi?.toString() : "", { shouldValidate: true });
    setNpi(prescriberDetails?.npi);
    setMobileNumber(prescriberDetails?.phone || "");
  }, [prescriberDetails, locations]);

  const checkNpiMutation = useMutation({ mutationFn: (payload: string) => doctorApiRepository.checkNpi(payload) });

  const checkNpiOnServer = useDebouncedCallback((value) => {
    if (value != prescriberDetails?.npi?.toString()) {
      setNpiChecking(true);
      checkNpiMutation.mutate(value, {
        onSuccess: (res) => {
          setNpiChecking(false);
          clearErrors("npiUnique");
          clearErrors("npi");
        },
        onError: (err) => {
          setNpiChecking(false);
          const error = err as AxiosError<IServerErrorResponse>;
          if (error?.response?.data?.message == "Doctor found with this NPI") {
            clearErrors("npi");
            setError("npiUnique", {
              type: "custom",
              message: "Please provide an unique npi number.",
            });
          } else {
            clearErrors("npiUnique");
          }
        },
      });
    } else {
      clearErrors("npiUnique");
      clearErrors("npi");
    }
  }, 800);

  useEffect(() => {
    setStates(locations.filter((item: any) => item?.type.toLowerCase() == "state"));
  }, [locations]);

  return (
    <div className="card">
      <div className="card-title with-border flex items-center justify-between">
        <h6>Basic Information</h6>
        {isEditable ? (
          <Group ms="auto">
            {basicInfoEditing ? (
              <>
                <Button
                  variant="transparent"
                  size="sm"
                  type="button"
                  classNames={{
                    label: "underline font-medium",
                  }}
                  onClick={basicInfoEditHandler.close}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  type="button"
                  onClick={handleSubmit(basicInfoSubmit, basicInfoError)}
                  loading={basicInfoMutation?.isPending}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="transparent"
                  size="sm"
                  type="button"
                  classNames={{
                    label: "text-primary underline text-xl/snug",
                  }}
                  onClick={basicInfoEditHandler.open}
                >
                  Edit
                </Button>
              </>
            )}
          </Group>
        ) : (
          ""
        )}
      </div>

      {basicInfoEditing ? (
        <form className="inner-wrapper">
          <div className="grid grid-cols-2 gap-6 w-full">
            <Input.Wrapper
              label="First Name"
              className=""
              error={errors.firstName?.message ? errors.firstName?.message : false}
              withAsterisk
            >
              <Input
                type="text"
                {...register("firstName")}
              />
            </Input.Wrapper>
            <Input.Wrapper
              label="Last Name"
              className=""
              error={errors.lastName?.message ? errors.lastName?.message : false}
              withAsterisk
            >
              <Input
                type="text"
                {...register("lastName")}
              />
            </Input.Wrapper>
            {shouldEditEmail ? (
              <Input.Wrapper
                label="Email Address"
                withAsterisk
                error={getErrorMessage(errors?.email)}
              >
                <Input
                  type="text"
                  {...register("email")}
                  error={Boolean(errors?.email?.message)}
                />
              </Input.Wrapper>
            ) : (
              ""
            )}
            <NumberInput
              {...register("phone")}
              onChange={(value) => {
                if (value) {
                  setValue("phone", value?.toString());
                }
                setMobileNumber(value?.toString());
              }}
              value={mobileNumber}
              label="Phone/Mobile No"
              error={errors.phone?.message ? errors.phone?.message : false}
              withAsterisk
              max={9999999999}
              min={0}
              hideControls
              clampBehavior="strict"
              allowDecimal={false}
              allowNegative={false}
            />

            {/* date of birth filed */}
            <Input.Wrapper
              label="Date of Birth"
              className="w-full"
              error={getErrorMessage(errors.dob)}
              withAsterisk
            >
              <div className="dml-Input-wrapper dml-Input-Calendar">
                <StyletronProvider value={engine}>
                  <BaseProvider theme={LightTheme}>
                    {/* <pre>{JSON.stringify(dob)}</pre> */}
                    <UberDatePicker
                      aria-label="Select a date"
                      placeholder="MM/DD/YYYY"
                      formatString="MM/dd/yyyy"
                      highlightedDate={maxDate}
                      maxDate={maxDate}
                      minDate={minDate}
                      value={dob}
                      mask="99/99/9999"
                      error={Boolean(getErrorMessage(errors.dob))}
                      onChange={(data) => {
                        setDob([data.date]);
                        setValue("dob", [data.date]);
                        if (data.date) {
                          clearErrors("dob");
                        }
                      }}
                      overrides={{
                        Popover: {
                          props: {
                            overrides: {
                              Body: {
                                style: {
                                  marginLeft: "20px",
                                  "z-index": "10",
                                },
                              },
                            },
                          },
                        },
                        MonthYearSelectButton: {
                          style: {
                            fontSize: "16px",
                            lineHeight: 1.4,
                            fontWeight: 700,
                            height: "50px",
                          },
                        },
                        MonthYearSelectIconContainer: {
                          style: {
                            marginLeft: "8px",
                          },
                        },
                        MonthYearSelectPopover: {
                          props: {
                            overrides: {
                              Body: {
                                style: {
                                  "z-index": 10,
                                },
                              },
                            },
                          },
                        },
                        WeekdayHeader: {
                          style: {
                            fontSize: "14px",
                            lineHeight: "26px",
                            height: "44px",
                            width: "50.29px",
                          },
                        },
                        Day: {
                          style: {
                            fontSize: "14px",
                            lineHeight: "26px",
                            height: "44px",
                            ":after": {
                              height: "40px",
                              width: "40px",
                              left: "7.77px",
                            },
                            ":before": {
                              top: "-3px",
                            },
                          },
                        },
                        InputLabel: {
                          style: {
                            fontSize: "14px",
                            color: "var(--dml-color-foreground)",
                            fontWeight: 500,
                          },
                        },
                        Input: {
                          props: {
                            overrides: {
                              Root: {
                                style: {
                                  border: "0px",
                                },
                              },
                              Input: {
                                style: {
                                  fontSize: "var(--dml-text-input-fs)",
                                  height: "var(--dml-input-height)",
                                  backgroundColor: "var(--dml-color-grey-btn)",
                                  borderRadius: "var(--dml-input-br)",
                                  boxShadow: "none",
                                },
                              },
                            },
                          },
                        },
                      }}
                    />
                  </BaseProvider>
                </StyletronProvider>
              </div>
            </Input.Wrapper>

            <Select
              data={[{ value: "1", label: "USA" }]}
              label="Country"
              defaultValue={"1"}
              rightSection={<i className="icon-down-arrow text-sm"></i>}
              disabled
              classNames={{
                wrapper: "bg-grey-btn rounded-md",
              }}
              {...register("country")}
              onChange={(value) => setValue("country", value || "")}
            />
            <Input.Wrapper
              label="Address"
              className=""
              error={errors.address?.message ? errors.address?.message : false}
              withAsterisk
            >
              <AddressAutoGoogle
                {...register("address")}
                address={address || ""}
                isError={Boolean(errors?.address?.message)}
                onSelect={(address) => {
                  if (address.address) {
                    const onlyAddress = address.address.split(",")[0];
                    setValue("address", onlyAddress, { shouldValidate: true });
                    setValue("state", address.state, { shouldValidate: true });
                    setValue("city", address.city, { shouldValidate: true });
                    setValue("zipCode", address.zip_code || "", { shouldValidate: true });
                    setState(address.state);
                    setAddress(onlyAddress);
                    setZipcode(parseInt(address.zip_code || ""));
                    clearErrors("address");
                  }
                }}
              />
            </Input.Wrapper>
            {/* <Select
              label="State"
              withAsterisk
              defaultValue={prescriberDetails?.addressable?.state?.toString() || ""}
              error={errors.state?.message ? errors.state?.message : false}
              rightSection={<i className="icon-down-arrow text-sm"></i>}
              {...register("state")}
              classNames={{
                wrapper: "bg-grey-btn rounded-md",
              }}
              onChange={(value: any) => {
                setValue("state", value);
                setValue("city", "");
                setCities(Locations.filter((item: any) => item.parent_id == value));
                setCitySearchVal("");
              }}
              data={states?.map((item: any) => {
                return {
                  value: item?.id ? item?.id?.toString() : "",
                  label: item?.name || "",
                };
              })}
              searchable
            /> */}

            <Input.Wrapper
              className="w-full"
              label="State"
              withAsterisk
              error={getErrorMessage(errors.state)}
            >
              <Input
                {...register("state")}
                value={state}
                disabled
              />
            </Input.Wrapper>

            {/* <Select
              label="City"
              withAsterisk
              error={errors.city?.message ? errors.city?.message : false}
              rightSection={<i className="icon-down-arrow text-sm"></i>}
              {...register("city")}
              classNames={{
                wrapper: "bg-grey-btn rounded-md",
              }}
              searchValue={citySearchVal}
              onSearchChange={setCitySearchVal}
              searchable
              onChange={(value, option) => {
                setValue("city", value || "");
                if (value) {
                  clearErrors("city");
                  setCitySearchVal(option.label);
                }
              }}
              data={cities.map((city: any) => ({
                value: city.id.toString(),
                label: city.name,
              }))}
            /> */}

            <Input.Wrapper
              className="w-full"
              label="City"
              withAsterisk
              error={getErrorMessage(errors.city)}
            >
              <Input {...register("city")} />
            </Input.Wrapper>

            <Input.Wrapper
              label="State LIC"
              className=""
              error={errors.stateLic?.message ? errors.stateLic?.message : false}
              withAsterisk
            >
              <Input
                type="text"
                {...register("stateLic")}
              />
            </Input.Wrapper>

            <NumberInput
              className="w-full"
              {...register("zipCode")}
              onChange={(value) => {
                setValue("zipCode", value.toString());
                setZipcode(value);
                if (value) {
                  clearErrors("zipCode");
                }
              }}
              label="Zip Code"
              withAsterisk
              error={getErrorMessage(errors.zipCode)}
              max={99999}
              min={0}
              hideControls
              clampBehavior="strict"
              allowNegative={false}
              allowDecimal={false}
              value={zipCode}
            />

            <NumberInput
              {...register("npi")}
              className="w-full"
              onChange={(value) => {
                setNpi(value);
                if (value) {
                  setValue("npi", value?.toString());
                  checkNpiOnServer(value);
                }
              }}
              rightSection={
                npiChecking ? (
                  <Loader
                    size={18}
                    opacity={0.8}
                    me={30}
                    color="grey"
                  />
                ) : (
                  ""
                )
              }
              value={npi}
              label="NPI"
              error={getErrorMessage(errors.npi) || getErrorMessage(errors.npiUnique)}
              max={9999999999}
              min={0}
              hideControls
              clampBehavior="strict"
              withAsterisk
            />
          </div>
        </form>
      ) : (
        <div className="pt-2">
          <Table
            withRowBorders={false}
            className="-ml-2.5 info-table info-table-md"
          >
            <Table.Tbody className="text-lg secondary.3">
              <Table.Tr>
                <Table.Th>First Name:</Table.Th>
                <Table.Td>{prescriberDetails?.first_name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Last Name:</Table.Th>
                <Table.Td>{prescriberDetails?.last_name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="font-normal">Npi:</Table.Th>
                <Table.Td>{prescriberDetails?.npi}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="font-normal">Date of Birth:</Table.Th>
                <Table.Td>{formatDate(prescriberDetails?.dob, "MMM DD, YYYY")}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="font-normal">Address:</Table.Th>
                <Table.Td>{prescriberDetails?.addressable?.address1}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="font-normal">Country:</Table.Th>
                <Table.Td>{"United States"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="font-normal">State:</Table.Th>
                <Table.Td>{prescriberDetails?.addressable?.state}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="font-normal">City:</Table.Th>
                <Table.Td>{prescriberDetails?.addressable?.city}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="font-normal">State LIC:</Table.Th>
                <Table.Td>{prescriberDetails?.state_lic}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th className="font-normal">Zip Code:</Table.Th>
                <Table.Td>{prescriberDetails?.addressable?.zip_code}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default PrescriberBasicInfo;
