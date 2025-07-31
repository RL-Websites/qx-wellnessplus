import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IDoctor, IDoctorBasicInfoDTO, IDoctorProfessionalInfoDTO } from "@/common/api/models/interfaces/Doctor.model";
import { IUserData } from "@/common/api/models/interfaces/User.model";
import doctorApiRepository from "@/common/api/repositories/doctorRepository";
import dmlToast from "@/common/configs/toaster.config";
import { Locations } from "@/common/constants/locations";
import { userAtom } from "@/common/states/user.atom";
import { formatDate } from "@/utils/date.utils";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Anchor, Button, Group, Input, NumberInput, Select, Table, TagsInput } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom } from "jotai/react";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { BaseWebDatePickerOverrides } from "@/common/configs/baseWebOverrides";
import { BaseProvider, LightTheme } from "baseui";
import { Datepicker as UberDatePicker } from "baseui/datepicker";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import * as yup from "yup";
import DocumentTag from "../../DocumentTag";
import EditableDocumentTag from "../../EditableDocumentTag";
import EligibleStates from "../../EligibleStates";
import FileUploader from "../../fileUploader";
const deaRegex = /^[A-Za-z]{2}[0-9]{7}$|^[A-Za-z]{1}9[0-9]{7}$|^[A-Za-z]{2}[0-9]{7}-[A-Za-z0-9]{1,7}$/;
const professionalInfoSchema = yup.object({
  currentPosition: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Current Position"),
  currentPractice: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Current Practice Institute"),
  state: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("State"),
  city: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("City"),
  zipCode: yup.string().required().typeError("Zip code is required").label("Zip Code"),
  dEa: yup
    .string()
    .nullable()
    .test("dea-or-na", "DEA must be valid or empty", (value) => {
      if (!value) return true; // Allow empty/null values
      return deaRegex.test(value);
    }),
  dea_expired_date: yup
    .array(yup.string().nonNullable(() => "Please provide a valid date of format MM/DD/YYYY."))
    .typeError("Please provide a valid date of format MM/DD/YYYY.")
    .required("Please provide your DEA expired date"),
  eductionDegree: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Recent Educational Degree"),
  eductionInstitute: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Recent Educational Institute"),
  eligibleStates: yup.array().of(yup.string().required()).min(1, "At least one state must be select").required("States are required"),
  documents: yup.array(),
});

type professionalInfoSchemaType = yup.InferType<typeof professionalInfoSchema>;

interface IPrescriberProfessionalInfo {
  isEditing?: boolean;
  prescriberDetails?: IDoctor;
  onUpdate: (success: boolean) => void;
}

function PrescriberProfessional({ prescriberDetails, isEditing, onUpdate }: IPrescriberProfessionalInfo) {
  const [zipCode, setZipcode] = useState<number | string>("");
  const [states, setStates] = useState<Array<object>>(Locations.filter((item: any) => item?.type.toLowerCase() == "state"));
  const [cities, setCities] = useState<Array<object>>([]);
  const [citySearchVal, setCitySearchVal] = useState("");
  const [professionalInfoEditing, professionalInfoEditHandler] = useDisclosure();
  const [userData] = useAtom<IUserData | null>(userAtom);
  const [documentError, setDocumentError] = useState<string>("");
  const [documentList, setDocumentList] = useState<FileWithPath[]>([]);
  const [city, setCity] = useState<string>("");
  const [isEligibleModalOpen, setIsEligibleModalOpen] = useDisclosure(false);
  const [deaExpiredDate, setDeaExpiredDate] = useState<any>(null);

  const engine = new Styletron();
  const minDate = new Date();

  const openEligibleModal = () => {
    setIsEligibleModalOpen.open();
  };

  const closeEligibleModal = () => {
    setIsEligibleModalOpen.close();
  };

  const professionalInfoEdit = () => {
    professionalInfoEditHandler.open();
  };

  const professionMethods = useForm({
    resolver: yupResolver(professionalInfoSchema),
    mode: "onTouched",
  });

  const {
    register: professionalInfoRegister,
    handleSubmit: professionalInfoHandleSubmit,
    setValue: professionalInfoSetValue,
    clearErrors: professionalInfoClearErrors,
    clearErrors,
    formState: { errors: professionalInfoErrors },
    control,
  } = professionMethods;

  useEffect(() => {
    // if (prescriberDetails?.profession_state) {
    //   setCities(
    //     Locations.filter((item: any) => {
    //       return item.parent_id == prescriberDetails?.profession_state;
    //     })
    //   );
    //   setCitySearchVal("");
    // }
    professionalInfoSetValue("currentPosition", prescriberDetails?.current_position || "", { shouldValidate: true });
    professionalInfoSetValue("currentPractice", prescriberDetails?.current_inst || "", { shouldValidate: true });
    professionalInfoSetValue("state", prescriberDetails?.profession_state || "", { shouldValidate: true });
    professionalInfoSetValue("city", prescriberDetails?.profession_city || "", { shouldValidate: true });
    setCity(prescriberDetails?.profession_city || "");
    if (prescriberDetails?.dea_expired_date?.length) {
      setDeaExpiredDate(new Date(prescriberDetails.dea_expired_date));
    }
    // setCitySearchVal(getLocName(prescriberDetails?.profession_city));
    professionalInfoSetValue("zipCode", prescriberDetails?.profession_zip_code || "", { shouldValidate: true });
    professionalInfoSetValue("dEa", prescriberDetails?.dea || "", { shouldValidate: true });
    professionalInfoSetValue("eductionDegree", prescriberDetails?.last_edu_degree || "", { shouldValidate: true });
    professionalInfoSetValue("eductionInstitute", prescriberDetails?.last_edu_inst || "", { shouldValidate: true });
    professionalInfoSetValue("eligibleStates", prescriberDetails?.eligible_states?.map((el) => el.name) || [], { shouldValidate: true });
  }, [prescriberDetails, professionalInfoSetValue, Locations]);

  useEffect(() => {
    if (prescriberDetails?.profession_zip_code) {
      setZipcode(prescriberDetails?.profession_zip_code);
      professionalInfoSetValue("zipCode", prescriberDetails?.profession_zip_code);
    }
    if (prescriberDetails?.documents?.length) {
      const newList = prescriberDetails?.documents?.map((item) => ({ ...item, document_id: item?.id, original_name: item?.display_name }));
      setDocumentList(newList);
    }
  }, [prescriberDetails]);

  const professionalInfoMutation = useMutation({
    mutationFn: (payload: IDoctorBasicInfoDTO) => doctorApiRepository.doctorProfInfoUpdate(payload),
  });

  const professionalInfoSubmit = (data: professionalInfoSchemaType) => {
    // if (!userData) return;
    const payload: IDoctorProfessionalInfoDTO = {
      userable_uid: userData?.userable_uid,
      current_position: data?.currentPosition || "",
      last_edu_inst: data?.eductionInstitute,
      last_edu_degree: data?.eductionDegree,
      current_inst: data?.currentPractice,
      profession_city: data?.city,
      profession_state: data?.state,
      eligible_states: data?.eligibleStates,
      profession_zip_code: data?.zipCode,
      dea: data?.dEa || undefined,
      dea_expired_date: data?.dea_expired_date ? formatDate(data.dea_expired_date[0], "MM-DD-YYYY") : undefined,
      documents: data?.documents,
      type: "profession",
    };

    professionalInfoMutation.mutate(payload, {
      onSuccess: () => {
        // setUserDataAtom(res?.data?.data);
        // setBasicInfoFormData(res?.data?.data);
        onUpdate(true);
        dmlToast.success({
          title: "Professional information updated successfully",
        });
        professionalInfoEditHandler.close();
      },
      onError: (error) => {
        const err = error as AxiosError<IServerErrorResponse>;
        dmlToast.error({
          title: err?.response?.data?.message,
        });
      },
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-title with-border flex items-center justify-between">
          <h6>Professional Information</h6>

          {isEditing && (
            <Group ms="auto">
              {professionalInfoEditing ? (
                <>
                  <button
                    className="text-foreground underline text-fs-lg"
                    onClick={professionalInfoEditHandler.close}
                  >
                    Cancel
                  </button>
                  <Button
                    size="sm"
                    type="submit"
                    onClick={professionalInfoHandleSubmit(professionalInfoSubmit)}
                    loading={professionalInfoMutation.isPending}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="text-fs-lg text-primary"
                    onClick={professionalInfoEdit}
                  >
                    Edit
                  </button>
                </>
              )}
            </Group>
          )}
        </div>
        {professionalInfoEditing ? (
          <div className="card-body pt-5">
            <FormProvider {...professionMethods}>
              <form className="inner-wrapper">
                <div className="grid grid-cols-2 gap-6 w-full">
                  <Input.Wrapper
                    label="Current Position"
                    className=""
                    error={professionalInfoErrors.currentPosition?.message ? professionalInfoErrors.currentPosition?.message : false}
                    withAsterisk
                  >
                    <Input
                      type="text"
                      {...professionalInfoRegister("currentPosition")}
                    />
                  </Input.Wrapper>
                  <Input.Wrapper
                    label="Current Practice Institute"
                    className=""
                    error={professionalInfoErrors.currentPractice?.message ? professionalInfoErrors.currentPractice?.message : false}
                    withAsterisk
                  >
                    <Input
                      type="text"
                      {...professionalInfoRegister("currentPractice")}
                    />
                  </Input.Wrapper>
                  <Select
                    label="State"
                    withAsterisk
                    rightSection={<i className="icon-down-arrow text-sm"></i>}
                    error={professionalInfoErrors.state?.message ? professionalInfoErrors.state?.message : false}
                    {...professionalInfoRegister("state")}
                    defaultValue={prescriberDetails?.profession_state?.toString() || ""}
                    classNames={{
                      wrapper: "bg-grey-btn rounded-md",
                    }}
                    onChange={(value: any) => {
                      professionalInfoSetValue("state", value);
                      // professionalInfoSetValue("city", "");
                      // setCities(
                      //   locations.filter((item: any) => {
                      //     return item.parent_id == value;
                      //   })
                      // );
                      if (value) {
                        professionalInfoClearErrors("state");
                      }
                      // setCitySearchVal("");
                    }}
                    data={states.map((item: any) => {
                      return {
                        value: item?.name.toString(),
                        label: item?.name,
                      };
                    })}
                    searchable
                  />

                  <Input.Wrapper
                    className="w-full"
                    label="City"
                    withAsterisk
                    error={getErrorMessage(professionalInfoErrors.city)}
                  >
                    <Input
                      value={city}
                      {...professionalInfoRegister("city")}
                      onChange={(ev) => {
                        setCity(ev.target.value);
                        professionalInfoSetValue("city", ev.target.value, { shouldValidate: true });
                      }}
                    />
                  </Input.Wrapper>

                  {/* <Select
                    label="City"
                    withAsterisk
                    error={professionalInfoErrors.city?.message ? professionalInfoErrors.city?.message : false}
                    rightSection={<i className="icon-down-arrow text-sm"></i>}
                    {...professionalInfoRegister("city")}
                    classNames={{ wrapper: "bg-grey-btn rounded-md" }}
                    searchable
                    searchValue={citySearchVal}
                    onSearchChange={setCitySearchVal}
                    onChange={(value, option) => {
                      professionalInfoSetValue("city", value || "");
                      if (value) {
                        setCitySearchVal(option.label);
                        professionalInfoClearErrors("city");
                      }
                    }}
                    data={cities.map((city: any) => ({
                      value: city.id.toString(),
                      label: city.name,
                    }))}
                  /> */}

                  <NumberInput
                    className="w-full"
                    {...professionalInfoRegister("zipCode")}
                    onChange={(value) => {
                      if (value) {
                        professionalInfoSetValue("zipCode", value.toString());
                        setZipcode(value);
                        clearErrors("zipCode");
                      }
                    }}
                    label="Zip Code"
                    withAsterisk
                    error={getErrorMessage(professionalInfoErrors.zipCode)}
                    max={99999}
                    min={0}
                    hideControls
                    clampBehavior="strict"
                    allowNegative={false}
                    value={zipCode}
                  />
                  <Input.Wrapper
                    label="DEA"
                    withAsterisk
                    className=""
                    error={professionalInfoErrors.dEa?.message ? professionalInfoErrors.dEa?.message : false}
                  >
                    <Input
                      type="text"
                      {...professionalInfoRegister("dEa")}
                    />
                  </Input.Wrapper>
                  <Input.Wrapper
                    label="DEA Expired Date"
                    className="w-full"
                    error={getErrorMessage(professionalInfoErrors.dea_expired_date)}
                    withAsterisk
                  >
                    <div className={`${professionalInfoErrors?.dea_expired_date ? "baseWeb-error" : ""} dml-Input-wrapper dml-Input-Calendar relative`}>
                      <StyletronProvider value={engine}>
                        <BaseProvider theme={LightTheme}>
                          {/* <pre>{JSON.stringify(dob)}</pre> */}
                          <UberDatePicker
                            aria-label="Select a date"
                            placeholder="MM/DD/YYYY"
                            formatString="MM/dd/yyyy"
                            minDate={minDate}
                            value={deaExpiredDate}
                            mask="99/99/9999"
                            error={true}
                            onChange={(data) => {
                              setDeaExpiredDate([data.date]);
                              professionalInfoSetValue("dea_expired_date", [data.date]);
                              if (data.date) {
                                clearErrors("dea_expired_date");
                              }
                            }}
                            overrides={BaseWebDatePickerOverrides}
                          />
                        </BaseProvider>
                      </StyletronProvider>
                    </div>
                  </Input.Wrapper>
                  <Input.Wrapper
                    label="Recent Educational Degree"
                    className=""
                    error={professionalInfoErrors.eductionDegree?.message ? professionalInfoErrors.eductionDegree?.message : false}
                    withAsterisk
                  >
                    <Input
                      type="text"
                      {...professionalInfoRegister("eductionDegree")}
                    />
                  </Input.Wrapper>
                  <Input.Wrapper
                    label="Recent Educational Institute"
                    className=""
                    error={professionalInfoErrors.eductionInstitute?.message ? professionalInfoErrors.eductionInstitute?.message : false}
                    withAsterisk
                  >
                    <Input
                      type="text"
                      {...professionalInfoRegister("eductionInstitute")}
                    />
                  </Input.Wrapper>

                  <TagsInput
                    label="States Eligible to Work"
                    withAsterisk
                    error={getErrorMessage(professionalInfoErrors.eligibleStates)}
                    {...professionalInfoRegister("eligibleStates")}
                    data={states.map((item: any) => {
                      return item?.name;
                    })}
                    defaultValue={prescriberDetails?.eligible_states?.map((el) => el.name)}
                    onChange={(value) => {
                      if (value) {
                        professionalInfoSetValue("eligibleStates", value);
                        professionalInfoClearErrors("eligibleStates");
                      }
                    }}
                  />

                  <div className="col-span-2 w-full">
                    <Input.Wrapper
                      className="w-full !block col-span-2"
                      label="Upload Certificates/ Relevant Documents"
                      error={documentError ? documentError : ""}
                    >
                      <Controller
                        control={control}
                        name={"documents"}
                        render={({ field }) => (
                          <FileUploader
                            folderName="doctor"
                            name={field.name}
                            maxSize={5 * 1024 ** 2}
                            control={control}
                            documents={documentList?.length ? documentList : []}
                            u_id={userData?.userable_uid}
                            onError={(msg) => setDocumentError(msg)}
                          />
                        )}
                      ></Controller>
                    </Input.Wrapper>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        ) : (
          <div className="pt-2">
            <Table
              withRowBorders={false}
              className="-ml-2.5 info-table info-table-lg"
            >
              <Table.Tbody className="text-lg secondary.3">
                <Table.Tr>
                  <Table.Th>Current Position:</Table.Th>
                  <Table.Td>{prescriberDetails?.current_position}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Recent Educational Institute:</Table.Th>
                  <Table.Td>{prescriberDetails?.current_inst}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">State:</Table.Th>
                  <Table.Td>{prescriberDetails?.profession_state}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">City:</Table.Th>
                  <Table.Td>{prescriberDetails?.profession_city}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">Zip Code:</Table.Th>
                  <Table.Td>{prescriberDetails?.profession_zip_code}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">DEA</Table.Th>
                  <Table.Td>{prescriberDetails?.dea}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">DEA Expired Date</Table.Th>
                  <Table.Td>{prescriberDetails?.dea_expired_date ? formatDate(prescriberDetails?.dea_expired_date, "MMMM DD, YYYY") : "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Recent Educational Degree:</Table.Th>
                  <Table.Td>{prescriberDetails?.last_edu_degree}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">Current Educational Institute:</Table.Th>
                  <Table.Td>{prescriberDetails?.last_edu_inst}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">States Eligible to Work:</Table.Th>
                  <Table.Td>
                    {prescriberDetails?.eligible_states?.length ? (
                      prescriberDetails?.eligible_states?.length > 3 ? (
                        <>
                          {prescriberDetails?.eligible_states?.length} states
                          <Anchor
                            underline="always"
                            fw={500}
                            ms={10}
                            onClick={() => setIsEligibleModalOpen.open()}
                          >
                            View
                          </Anchor>
                        </>
                      ) : (
                        <Group className="gap-2">
                          {prescriberDetails?.eligible_states.map((item, index) => (
                            <DocumentTag
                              badgeColor="bg-tag-bg text-foreground"
                              key={index}
                              badgeText={item?.name}
                              childrenOne
                              childrenTwo
                            />
                          ))}
                        </Group>
                      )
                    ) : (
                      "N/A"
                    )}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">Uploaded Certificates/ Relevant Documents:</Table.Th>
                  <Table.Td>
                    {prescriberDetails?.documents?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {prescriberDetails?.documents.map((item, index) => (
                          <EditableDocumentTag
                            key={index}
                            docName={item.display_name ? item.display_name : item.file_name ? item.file_name : ""}
                            leftIconClass="icon-pdf"
                            viewLink={`${import.meta.env.VITE_BASE_PATH}${item?.file_full_path}`}
                          />
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        )}
      </div>
      <EligibleStates
        isOpen={isEligibleModalOpen}
        onClose={closeEligibleModal}
        stateIds={prescriberDetails?.eligible_states}
      />
    </>
  );
}

export default PrescriberProfessional;
