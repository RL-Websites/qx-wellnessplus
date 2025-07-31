import { IPrescriptionDetails } from "@/common/api/models/interfaces/Prescription.model";
import prescriptionApiRepository from "@/common/api/repositories/prescriptionRepository";
import { formatDate } from "@/utils/date.utils";
import { formatPhoneNumber } from "@/utils/helper.utils";
import { Button, Modal, ScrollArea } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ModalProps {
  openModal: boolean;
  onModalClose: () => void;
  prescriptionId?: number;
  patientId?: number;
  patientData?: IPrescriptionDetails | null;
}

function IntakeForm({ openModal, onModalClose, prescriptionId, patientId, patientData }: ModalProps) {
  const [intakeFormParam, setIntakeFormParam] = useState<any>();

  useEffect(() => {
    if (prescriptionId && patientId) {
      setIntakeFormParam({ patientId: patientId, prescriptionId: prescriptionId });
    }
  }, [prescriptionId, patientId]);

  const intakeFormQuery = useQuery({
    queryKey: ["GetIntakeForm", patientId, prescriptionId],
    queryFn: () => prescriptionApiRepository.getIntakeFormData(intakeFormParam),
  });
  const intakeFormData = intakeFormQuery?.data?.data?.data;

  // const intakeFormPdf = useQuery({
  //   queryKey: ["IntakeFormPdf", patientId, prescriptionId],
  //   queryFn: () => prescriptionApiRepository.getIntakeFormPdf(intakeFormParam),
  // });
  // const intakeFormPdfData = intakeFormPdf?.data?.data?.data;

  return (
    <>
      <Modal.Root
        opened={openModal}
        onClose={onModalClose}
        size="1128px"
        centered
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header className="border-b border-b-grey-low !pt-3.5 !px-6 !pb-3">
            <Modal.Title>Intake Form</Modal.Title>
            <div className="flex items-center gap-3">
              <Button
                h="40px"
                bg="grey.4"
                c="foreground"
                component={Link}
                to={`${import.meta.env.VITE_BASE_URL}/download/intake-form-pdf/${prescriptionId}`}
                target="_blank"
                rightSection={<i className="icon-pdf text-sm leading-3.5"></i>}
              >
                Print
              </Button>
              <Button
                h="40px"
                bg="grey.4"
                c="foreground"
                component={Link}
                to={`${import.meta.env.VITE_BASE_URL}/download/intake-form-pdf/${prescriptionId}`}
                target="_blank"
                rightSection={<i className="icon-download-04 text-sm leading-3.5"></i>}
              >
                Download PDF
              </Button>
              <i
                className="icon-cross text-2xl leading-6 cursor-pointer"
                onClick={onModalClose}
              ></i>
            </div>
          </Modal.Header>
          <Modal.Body className="!pl-6 !pr-0 !pt-6">
            <ScrollArea.Autosize
              type="always"
              scrollbarSize={6}
              scrollbars="y"
              offsetScrollbars
              classNames={{
                root: "h-[calc(100vh_-_230px)]",
                viewport: "view-port-next-inner pr-6",
              }}
            >
              <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-x-[50px] pb-4 border-b border-b-grey-low">
                <div className="flex flex-col gap-6 xl:col-span-2">
                  <span className="extra-form-text-medium text-foreground">Drug Name</span>
                  <p className="text-grey text-fs-sp">{patientData?.medication?.drug_name || "N/A"}</p>
                </div>
                <div className="flex flex-col gap-6">
                  <span className="extra-form-text-medium text-foreground">Drug Strength</span>
                  <p className="text-grey text-fs-sp">{patientData?.medication?.drug_strength || "N/A"}</p>
                </div>
                {/* <div className="flex flex-col gap-6">
                  <span className="extra-form-text-medium text-foreground">Drug No</span>
                  <p className="text-grey text-fs-sp">{patientData?.medication?.drug_no || "N/A"}</p>
                </div>
                <div className="flex flex-col gap-6 xl:col-span-2">
                  <span className="extra-form-text-medium text-foreground">Diagnosis</span>
                  <p className="text-grey text-fs-sp">{patientData?.medication?.diagnosis || "N/A"}</p>
                </div> */}
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-x-[50px] gap-y-6 py-4 border-b border-b-grey-low">
                <div className="flex flex-col gap-6">
                  <span className="extra-form-text-medium text-foreground">First Name</span>
                  <p className="text-grey text-fs-sp">{intakeFormData?.first_name || "N/A"}</p>
                </div>
                <div className="flex flex-col gap-6">
                  <span className="extra-form-text-medium text-foreground">Last Name</span>
                  <p className="text-grey text-fs-sp">{intakeFormData?.last_name || "N/A"}</p>
                </div>

                <div className="flex flex-col xl:col-span-2 gap-6">
                  <span className="extra-form-text-medium text-foreground">Email Address</span>
                  <p className="text-grey text-fs-sp break-all">{intakeFormData?.email || "N/A"}</p>
                </div>
                <div className="flex flex-col gap-6">
                  <span className="extra-form-text-medium text-foreground">Phone Number</span>
                  <p className="text-grey text-fs-sp">{intakeFormData?.cell_phone ? formatPhoneNumber(intakeFormData?.cell_phone) : "N/A"}</p>
                </div>
                <div className="flex flex-col gap-6">
                  <span className="extra-form-text-medium text-foreground">Sex</span>
                  <p className="text-grey text-fs-sp capitalize">{intakeFormData?.gender || "N/A"}</p>
                </div>
                {/* <div className="flex flex-col gap-6">
                  <span className="extra-form-text-medium text-foreground">Height</span>
                  <p className="text-grey text-fs-sp">{"N/A"}</p>
                </div>
                <div className="flex flex-col gap-6">
                  <span className="extra-form-text-medium text-foreground">Weight (LBS)</span>
                  <p className="text-grey text-fs-sp">{"N/A"}</p>
                </div> */}
                <div className="flex flex-col xl:col-span-2 gap-6">
                  <span className="extra-form-text-medium text-foreground">Date of Birth</span>
                  <p className="text-grey text-fs-sp">{formatDate(intakeFormData?.dob, "MMMM DD, YYYY")}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6 pt-6">
                {intakeFormData?.questionnaires.map((item, index) => (
                  <div
                    className="flex flex-col gap-3.5"
                    key={index}
                  >
                    <span className="extra-form-text-regular text-grey">{item.question}</span>
                    {Array.isArray(item.answer) ? (
                      <p className="extra-form-text-medium text-foreground">
                        {item.answer.map((ans, idx) => {
                          if (idx === 0) {
                            return `- ${ans}`;
                          } else {
                            return `, ${ans}`;
                          }
                        })}
                      </p>
                    ) : item?.is_document ? (
                      <a
                        href={`${import.meta.env.VITE_BASE_PATH}/storage/${item?.answer}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        View Report
                      </a>
                    ) : (
                      <p className="extra-form-text-medium text-foreground">- {item.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea.Autosize>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

export default IntakeForm;
