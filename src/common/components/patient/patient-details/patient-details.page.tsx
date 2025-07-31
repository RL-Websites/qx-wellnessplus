import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IManageStatusDTO } from "@/common/api/models/interfaces/Patient.model";
import prescriptionApiRepository from "@/common/api/repositories/prescriptionRepository";
import ConfirmationWithReason from "@/common/components/ConfirmationWithReason";
import dmlToast from "@/common/configs/toaster.config";
import { userAtom } from "@/common/states/user.atom";
import { formatDate, getAge } from "@/utils/date.utils";
import { formatPhoneNumber } from "@/utils/helper.utils";
import { getTimeFromDateString } from "@/utils/time.utils";
import { ActionIcon, Avatar, Button, Input, ScrollArea, Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPrinter } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useAtomValue } from "jotai/react";
import { useState } from "react";
import { Link, NavLink, NavLink as RdNavLink, useNavigate, useParams } from "react-router-dom";
import DynamicBreadcrumbs from "../../Breadcrumbs";
import DocumentList from "../components/DocumentList";
import { DrivingLicense } from "../components/DrivingLicense";
import IntakeForm from "../components/IntakeForm";
import RequestTestReport from "../components/RequestTestReport";
import SoapNote from "../components/SoapNote";
interface IBreadcrumb {
  label?: string;
  path?: string;
  pageLoad?: string;
}

const CommonPatientDetailsPage = ({ label, path }: IBreadcrumb) => {
  const [openIntakeForm, setOpenIntakeForm] = useDisclosure();
  const [openSoapNote, setOpenSoapNote] = useDisclosure();
  const [openRequestTest, setOpenRequestTest] = useDisclosure();
  const [openDeclinePatient, HandleDeclinePatient] = useDisclosure();
  const [openBackToQueue, HandleBackToQueue] = useDisclosure();
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const userData = useAtomValue(userAtom);
  const navigate = useNavigate();

  const { id: patientId } = useParams();

  const menuItems = [
    {
      title: `${label}`,
      href: `${path}`,
    },
    {
      title: "Patient Details",
    },
  ];

  const onDeclineModalClose = (reason) => {
    if (reason !== false) {
      handleChangeStatus(patientId || "", "declined", reason);
    }

    HandleDeclinePatient.close();
  };

  const onBackToQueueModalClose = (reason) => {
    if (reason !== false) {
      handleChangeStatus(patientId || "", "pending", reason);
    }
    HandleBackToQueue.close();
  };

  const patientQuery = useQuery({
    queryKey: ["patientDetails", patientId],
    queryFn: () => prescriptionApiRepository.getPrescriptionDetails(patientId || ""),
  });

  const patientData = patientQuery?.data?.data?.data;

  const changeStatusMutation = useMutation({
    mutationFn: (payload: IManageStatusDTO) => prescriptionApiRepository.managePrescriptionStatus(payload),
  });

  const handleChangeStatus = (id: string, status: string, note?: string) => {
    const payload: IManageStatusDTO = { id: id, treatment_status: status, note: note || "" };

    let message = "Patient status updated successfully";

    switch (status) {
      case "accepted":
        message = "Patient has been accepted successfully";
        setIsAccepting(true);
        break;
      case "in_queue":
        message = "Patient has been added to queue successfully";
        break;
      case "pending":
        message = "Patient has been sent back to queue successfully";
        break;
      case "declined":
        message = "Patient has been declined successfully";
        break;
      default:
        message = "Patient status updated successfully";
        break;
    }

    changeStatusMutation.mutate(payload, {
      onSuccess: () => {
        dmlToast.success({
          title: message,
        });
        if (status == "accepted") {
          // let rootPath = "doctor";
          // switch (userData?.userable_type) {
          //   case "doctor":
          //     rootPath = "doctor";
          //     break;
          //   case "physician":
          //     rootPath = "physician";
          //     break;
          //   default:
          //     rootPath = "doctor";
          //     break;
          // }
          // navigate(`/${rootPath}/patient-in-progress/${patientData?.u_id}/details`);
          navigate(`../../patient-in-progress/${patientData?.u_id}/details`);
        }
        setIsAccepting(false);
        patientQuery.refetch();
      },
      onError: (error) => {
        const err = error as AxiosError<IServerErrorResponse>;
        dmlToast.error({
          message: err?.response?.data?.message,
          title: "Oops, Something went wrong",
        });
        setIsAccepting(false);
      },
    });
  };

  const getLabTestStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "text-tag-bg-deep bg-tag-bg";
      case "uploaded":
        return "text-gree bg-green-low";
      default:
        return "text-tag-bg-deep bg-tag-bg";
    }
  };

  const getLabTestStatusName = (status: string) => {
    switch (status) {
      case "pending":
        return "Requested";
      case "uploaded":
        return "Uploaded";
      default:
        return "Requested";
    }
  };

  const closeRequestTestModal = () => {
    patientQuery.refetch();
    setOpenRequestTest.close();
  };

  const handleSoapNoteUpdate = () => {
    setIsButtonVisible(true);
    patientQuery.refetch();
  };

  return (
    <div className="patient-details">
      <div className="page-title">
        <div className="page-title-start flex items-center gap-4">
          <h6 className="lg:h2 md:h3 sm:h4">Patient Details</h6>
          {(patientData?.treatment_status == "accepted" && <span className="tags bg-green-low text-green">Accepted</span>) ||
            (patientData?.treatment_status == "completed" && <span className="tags bg-primary-light text-primary">Completed</span>) ||
            (patientData?.treatment_status == "in_queue" && <span className="tags bg-tag-bg text-tag-bg-deep">In Queue</span>) ||
            (patientData?.treatment_status == "declined" && <span className="tags bg-danger-light text-danger-deep">Declined</span>)}
        </div>
        <div className="page-title-end flex-wrap">
          <Button
            variant="transparent"
            component={RdNavLink}
            to={`${path}/${patientData?.u_id}/details/patient-history/${patientData?.patient?.id}`}
            className="text-fs-sm text-foreground underline !font-medium mr-3"
          >
            Patient History
          </Button>
          {((patientData?.treatment_status == "accepted" && userData?.userable_type === "doctor") ||
            (patientData?.treatment_status == "completed" && userData?.userable_type === "doctor")) && (
            <>
              {patientData?.treatment_status == "accepted" && (
                <>
                  <Button
                    bg="grey.4"
                    size="sm"
                    c="foreground"
                    onClick={HandleDeclinePatient.open}
                  >
                    Decline
                  </Button>
                  <Link
                    to={`/doctor/patient-in-progress/${patientData?.u_id}/make-schedule`}
                    className="extra-text-14-medium bg-grey-low text-foreground py-2 px-3 rounded-lg"
                  >
                    Make a Schedule
                  </Link>
                </>
              )}

              <Link to={`/doctor/patient-in-progress/${patientData?.u_id}/create-prescription`}>
                <Button size="sm">Create Prescription</Button>
              </Link>
            </>
          )}

          <ConfirmationWithReason
            openModal={openDeclinePatient}
            onModalClose={onDeclineModalClose}
            title="Are you sure you want to decline the patient? Please specify the reason below."
            confirmBtnText="Decline"
          />
        </div>
      </div>
      <DynamicBreadcrumbs
        items={menuItems}
        separatorMargin="1"
      />
      {patientData?.treatment_status == "declined" && patientData?.note ? (
        <div className="card bg-danger-light text-danger-deep mb-6">
          <h6 className="mb-4">Decline Note</h6>
          <p className="extra-form-text-regular">{patientData?.note}</p>
        </div>
      ) : (
        ""
      )}

      <div className="flex xl:flex-row flex-col gap-6">
        <div className={`xl:w-[calc(100%_-_448px)] xl:order-1 order-2 ${patientData?.treatment_status === "in_queue" ? "xl:w-full w-full" : ""}`}>
          <div className="card p-6">
            <div className="card-title flex items-center justify-between">
              <h6>Drug Details</h6>
              <Button
                h="40px"
                onClick={() => setOpenIntakeForm.open()}
                rightSection={<i className="icon-view text-xl"></i>}
              >
                View Intake Form
              </Button>
              <IntakeForm
                openModal={openIntakeForm}
                onModalClose={setOpenIntakeForm.close}
                patientId={patientData?.patient?.id}
                prescriptionId={patientData?.id}
                patientData={patientData}
              />
            </div>

            <div className="drug-info-table">
              <Table
                withRowBorders={false}
                className="info-table info-table-sm"
              >
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th>Client Name:</Table.Th>
                    <Table.Td>{patientData?.client?.name}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Drug Name:</Table.Th>
                    <Table.Td>{patientData?.medication?.drug_name ? <Text className="extra-form-text-regular">{patientData?.medication?.drug_name}</Text> : "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Drug Strength:</Table.Th>
                    <Table.Td>
                      {patientData?.medication?.drug_strength ? <Text className="extra-form-text-regular">{patientData?.medication?.drug_strength}</Text> : "N/A"}
                    </Table.Td>
                  </Table.Tr>

                  {patientData?.suggested_medication ? (
                    <Table.Tr>
                      <Table.Th>Recommended Medication:</Table.Th>
                      <Table.Td className="font-semibold">{patientData?.suggested_medication}</Table.Td>
                    </Table.Tr>
                  ) : (
                    <></>
                  )}
                  {patientData?.suggested_reason ? (
                    <Table.Tr>
                      <Table.Th>Recommended Reason:</Table.Th>
                      <Table.Td className="font-semibold">{patientData?.suggested_reason}</Table.Td>
                    </Table.Tr>
                  ) : (
                    <></>
                  )}

                  <Table.Tr>
                    <Table.Th>Preferred Pharmacy:</Table.Th>
                    <Table.Td className="font-semibold">{patientData?.medication?.pharmacy?.name || "N/A"}</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
            <div className="mt-4">
              <hr />
            </div>

            <div className="card-title flex items-center justify-between mt-3">
              <h6>Patient Information</h6>
            </div>
            <div className="patient-info-table">
              <Table
                withRowBorders={false}
                className="info-table info-table-sm"
              >
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th>Patient Name:</Table.Th>
                    <Table.Td>{patientData?.patient?.name || "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Patient Source:</Table.Th>
                    <Table.Td>{patientData?.client?.name || "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Address:</Table.Th>
                    <Table.Td>{patientData?.patient?.address1 || "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>State:</Table.Th>
                    <Table.Td>{patientData?.patient?.state || "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>City:</Table.Th>
                    <Table.Td>{patientData?.patient?.city || "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Zip code:</Table.Th>
                    <Table.Td>{patientData?.patient?.zipcode || "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Phone:</Table.Th>
                    <Table.Td>{patientData?.patient?.cell_phone ? formatPhoneNumber(patientData?.patient?.cell_phone) : "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Gender:</Table.Th>
                    <Table.Td className="capitalize">{patientData?.patient?.gender || "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>DOB:</Table.Th>
                    <Table.Td>{formatDate(patientData?.patient?.dob, "MMMM DD, YYYY") || "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Email Address:</Table.Th>
                    <Table.Td>{patientData?.patient?.email || "N/A"}</Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Th>Request Date:</Table.Th>
                    <Table.Td>
                      {patientData?.created_at ? formatDate(patientData?.created_at, "MMM DD, YYYY") : ""}{" "}
                      {patientData?.created_at ? getTimeFromDateString(patientData?.created_at) : ""}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Request For:</Table.Th>
                    <Table.Td>
                      {patientData?.medication?.drug_name ? <Text className="extra-form-text-regular">{patientData?.medication?.drug_name || "N/A"}</Text> : "N/A"}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Age:</Table.Th>
                    <Table.Td>{getAge(patientData?.patient?.dob || "") || "N/A"}</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>

            {/* Driving License */}
            {patientData?.driving_license_front || patientData?.driving_license_back ? (
              <DrivingLicense
                frontImg={patientData?.driving_license_front}
                backImg={patientData?.driving_license_back}
              />
            ) : (
              ""
            )}
            {/* Documents */}
            {patientData?.documents?.length ? (
              <>
                <div className="card-title mt-6 mb-5">
                  <h6>Documents ({patientData?.documents?.length})</h6>
                </div>
                <DocumentList documents={patientData?.documents} />
              </>
            ) : (
              ""
            )}

            {patientData?.treatment_status == "pending" || userData?.userable_type == "admin" ? (
              ""
            ) : (
              <>
                <div className="card-title flex items-center mt-9">
                  <h6>Lab results</h6>
                  {patientData?.lab_test_files?.length && patientData?.treatment_status !== "declined" && patientData?.treatment_status !== "completed" ? (
                    <Button
                      variant="transparent"
                      leftSection={<i className="icon-add-request text-lg/none"></i>}
                      color="primary"
                      size="xs"
                      ml="auto"
                      onClick={() => setOpenRequestTest.open()}
                    >
                      <span className="underline text-fs-md font-medium">Request a Report</span>
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
                {patientData?.lab_test_files?.length ? (
                  <ScrollArea
                    type="always"
                    scrollbarSize={6}
                    scrollbars="x"
                    offsetScrollbars
                    classNames={{
                      root: "w-full",
                      viewport: "view-port-next-inner",
                    }}
                  >
                    <Table
                      verticalSpacing="md"
                      withRowBorders={false}
                      miw={632}
                      layout="fixed"
                      striped
                      stripedColor="background"
                      highlightOnHover
                      highlightOnHoverColor="primary.0"
                      className="dml-list-table"
                    >
                      <Table.Thead className="border-b border-grey-low">
                        <Table.Tr>
                          <Table.Th w={60}>SL</Table.Th>
                          <Table.Th>Test Name</Table.Th>
                          <Table.Th>Status</Table.Th>
                          <Table.Th>Date</Table.Th>
                          <Table.Th w={60}></Table.Th>
                          <Table.Th w={60}></Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {patientData?.lab_test_files.map((item, index) => (
                          <Table.Tr key={index}>
                            <Table.Td>{index + 1}</Table.Td>
                            <Table.Td>{item?.lab_test?.name}</Table.Td>
                            <Table.Td>
                              <span className={`tags capitalize ${getLabTestStatusClass(item?.status)}`}>{getLabTestStatusName(item?.status)}</span>
                            </Table.Td>
                            <Table.Td>{formatDate(item?.created_at, "MMMM DD, YYYY")}</Table.Td>
                            <Table.Td>
                              <NavLink
                                to={item?.status == "pending" ? "" : `${import.meta.env.VITE_BASE_PATH}/storage/test_files/${item?.uploaded_file}`}
                                target={item?.status == "pending" ? "_self" : "_blank"}
                                className={`text-sm underline font-medium ${item?.status == "pending" ? "text-grey" : "text-primary"}`}
                              >
                                View
                              </NavLink>
                            </Table.Td>
                            <Table.Td>
                              <ActionIcon
                                variant="transparent"
                                size={20}
                                bd={0}
                                c={item?.status == "pending" ? "grey" : "primary"}
                                component={Link}
                                to={item?.status == "pending" ? "" : `${import.meta.env.VITE_BASE_URL}/download-lab-test-file?prescription_doc_id=${item?.id}`}
                              >
                                <i className="icon-download-04 text-xl/none"></i>
                              </ActionIcon>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <div className="border border-grey-low rounded px-9 py-[26px] flex flex-col items-center gap-5 mb-6 mt-5">
                    <p className="extra-text-medium text-grey-medium">No lab results available at the moment</p>
                    <Button
                      size="sm"
                      variant="outline"
                      color="primary"
                      leftSection={<i className="icon-add"></i>}
                      onClick={() => setOpenRequestTest.open()}
                      disabled={patientData?.status != "accepted"}
                    >
                      Request a Report
                    </Button>
                  </div>
                )}

                <RequestTestReport
                  openModal={openRequestTest}
                  onModalClose={closeRequestTestModal}
                  doctor_id={userData?.id}
                  prescription_u_id={patientData?.u_id}
                />
              </>
            )}

            {(patientData?.treatment_status == "in_queue" && userData?.userable_type === "doctor") ||
            (patientData?.treatment_status == "pending" && userData?.userable_type === "doctor") ||
            (patientData?.treatment_status == "pending" && userData?.userable_type === "physician") ||
            (patientData?.treatment_status == "accepted" && userData?.userable_type === "admin") ? (
              <div className="flex justify-center gap-3 card">
                {patientData?.treatment_status == "pending" ? (
                  <Button
                    bg="grey.4"
                    c="foreground"
                    size="md"
                    w="224px"
                    onClick={() => handleChangeStatus(patientData?.u_id || "", "in_queue")}
                  >
                    Add to My Queue
                  </Button>
                ) : (
                  <>
                    {userData?.userable_type !== "admin" && (
                      <Button
                        bg="grey.4"
                        c="foreground"
                        size="md"
                        w="224px"
                        onClick={HandleBackToQueue.open}
                      >
                        Back To Queue
                      </Button>
                    )}
                  </>
                )}
                {patientData?.treatment_status !== "accepted" && (
                  <Button
                    size="md"
                    w="224px"
                    onClick={() => handleChangeStatus(patientData?.u_id || "", "accepted")}
                    loading={isAccepting}
                  >
                    Accept
                  </Button>
                )}
              </div>
            ) : (
              ""
            )}

            <ConfirmationWithReason
              openModal={openBackToQueue}
              onModalClose={onBackToQueueModalClose}
              title="Are you sure you want to send the request back to the queue? Please specify the reason below."
              confirmBtnText="Send Back to Queue"
            />
          </div>
        </div>
        {!["in_queue", "pending"].includes(patientData?.treatment_status ?? "") && (
          <div className="xl:w-[424px] w-full flex flex-col gap-6 xl:order-2 order-1">
            {userData?.userable_type !== "admin" && (
              <>
                <div className={`${patientData?.treatment_status === "in_queue" || patientData?.treatment_status === "declined" ? "hidden" : ""}`}>
                  {patientData?.soap_notes_count ? (
                    <div className="flex rounded-lg">
                      <Button
                        size="md"
                        rightSection={<i className="icon-pencil-edit text-xl/none"></i>}
                        classNames={{
                          root: "rounded-r-none w-full",
                          label: "text-lg font-medium",
                        }}
                        onClick={() => setOpenSoapNote.open()}
                      >
                        Soap Note
                      </Button>
                      <div className="bg-grey-btn rounded-r-lg flex items-center w-[calc(100%_-_293px)]">
                        <ActionIcon
                          classNames={{
                            root: "bg-grey-btn h-full rounded-none w-[60px] hover:bg-grey",
                            icon: "text-black",
                          }}
                          component={Link}
                          to={`${import.meta.env.VITE_BASE_URL}/download/soap-note/${patientData?.details?.prescription_id}`}
                          target="_blank"
                        >
                          <IconPrinter
                            stroke={1}
                            size={20}
                          />
                        </ActionIcon>
                        <div className="w-[1px] h-5 bg-grey-medium"></div>
                        <ActionIcon
                          classNames={{
                            root: "bg-grey-btn h-full rounded-l-none w-[60px] hover:bg-grey",
                            icon: "text-black",
                          }}
                          component={Link}
                          to={`${import.meta.env.VITE_BASE_URL}/download/soap-note/${patientData?.details?.prescription_id}`}
                          target="_blank"
                        >
                          <i className="icon-download-04 text-xl/none" />
                        </ActionIcon>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="md"
                      radius="8px"
                      rightSection={<i className="icon-add text-base"></i>}
                      onClick={() => setOpenSoapNote.open()}
                      className="w-full"
                    >
                      Soap Note
                    </Button>
                  )}

                  <SoapNote
                    openModal={openSoapNote}
                    onModalClose={setOpenSoapNote.close}
                    patientId={patientData?.patient?.id}
                    prescriptionId={patientData?.details?.prescription_id}
                    patientData={patientData}
                    onUpdate={handleSoapNoteUpdate}
                  />
                </div>
              </>
            )}
            <div className={`card pb-6 ${patientData?.treatment_status === "in_queue" ? "hidden" : ""}`}>
              <div className="card-title pb-6">
                <h6>Upcoming Schedule</h6>
              </div>
              {patientData?.appointment_schedules ? (
                <div>
                  <h2 className="text-grey mb-5">{dayjs(patientData?.appointment_schedules?.appointment_date).format("MMMM D, YYYY")}</h2>
                  <p className="text-fs-lg">
                    {dayjs("2024-09-03 " + patientData?.appointment_schedules?.slot?.start_time).format("h:mm A") +
                      " - " +
                      dayjs("2024-09-03 " + patientData?.appointment_schedules?.slot?.end_time).format("h:mm A")}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <Avatar
                    src="/images/profile-blank.svg"
                    size="72px"
                  ></Avatar>
                  <h5 className="text-grey-medium">No upcoming schedule with this patient</h5>
                </div>
              )}
            </div>

            {userData?.userable_type !== "admin" && (
              <div className="card pb-6">
                <div className="card-title with-border flex items-center justify-between">
                  <h6>Communication</h6>
                  <i className="icon-phone text-2xl text-primary"></i>
                </div>
                <div className="card-body p-4 text-center">
                  <Button
                    size="sm"
                    mb="md"
                    variant="transparent"
                    className="extra-text-medium text-grey"
                  >
                    Tap to send
                  </Button>
                  <ul className="flex flex-col gap-2 min-h-[260px] max-h-0 overflow-y-auto">
                    <li className="p-2.5 rounded bg-primary-light text-primary text-fs-sm">Hello Michael</li>
                    <li className="p-2.5 rounded bg-primary-light text-primary text-fs-sm">Need to clear some confusions regarding your prescription.</li>
                    <li className="p-2.5 rounded bg-primary-light text-primary text-fs-sm">When are you available for a meeting?</li>
                    <li className="p-2.5 rounded bg-primary-light text-primary text-fs-sm">Hio Michael</li>
                    <li className="p-2.5 rounded bg-primary-light text-primary text-fs-sm">When are you available for a meeting?</li>
                  </ul>
                </div>
                <div className="card-footer flex items-center w-full mt-10">
                  <Input.Wrapper className="w-full">
                    <Input
                      placeholder="Write a message"
                      leftSection={
                        <Button
                          variant="primary"
                          className="p-0 h-7 w-7 rounded-full"
                        >
                          <i className="icon-add"></i>
                        </Button>
                      }
                      rightSection={
                        <Button
                          variant="primary"
                          className="w-12 h-12 rounded-full p-0"
                        >
                          <i className="icon-send text-2xl"></i>
                        </Button>
                      }
                      styles={{
                        input: {
                          minHeight: "48px",
                          height: "100%",
                          paddingInline: "55px",
                          borderRadius: "50px",
                        },
                        section: {
                          pointerEvents: "all",
                        },
                      }}
                    />
                  </Input.Wrapper>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonPatientDetailsPage;
