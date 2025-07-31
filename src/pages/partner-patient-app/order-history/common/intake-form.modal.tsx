import prescriptionApiRepository from "@/common/api/repositories/prescriptionRepository";
import { Image, Modal, ScrollArea } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface ModalProps {
  openModal: boolean;
  onModalClose: () => void;
  patientId?: number;
}

function IntakeForm({ openModal, onModalClose, patientId }: ModalProps) {
  const patientQuery = useQuery({
    queryKey: ["prescriptionDetails", patientId],
    queryFn: () => prescriptionApiRepository.getPrescriptionDetails(patientId || ""),
  });

  const patientData = patientQuery?.data?.data?.data;
  console.log(patientData);
  useEffect(() => {}, []);
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
          <Modal.Header className="border-b border-b-grey-low !pt-3.5 !px-6 !pb-3 flex-wrap sm:gap-0 gap-3">
            <Modal.Title>Intake Form</Modal.Title>
            <div className="flex items-center gap-3">
              {/* <Button
                h="40px"
                bg="grey.4"
                c="foreground"
                component={Link}
                to={`${import.meta.env.VITE_BASE_URL}/partner/patient-intake-download?prescription_id=${patientData?.id}&patient_id=${patientData?.patient_id}&print_download=true`}
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
                to={`${import.meta.env.VITE_BASE_URL}/partner/patient-intake-download?prescription_id=${patientData?.id}&patient_id=${patientData?.patient_id}&print_download=true`}
                target="_blank"
                rightSection={<i className="icon-download-04 text-sm leading-3.5"></i>}
              >
                Download PDF
              </Button> */}
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
              {/* <div className="pb-4 border-b border-b-grey-low">
                <div className="flex flex-col gap-3.5">
                  <span className="extra-form-text-regular text-grey">
                    1. What brings the client to DocUspa at this time? Check all that apply. If "other" is selected, you must explain in the text box provided below. We will NOT
                    approve a blanket treatment request. The client MUST have some knowledge of the treatment type they wish to receive. It is the clinic/clinician's responsibility
                    to advise the client of treatment options within their clinic and scope of practice. DocUspa DOES NOT determine the treatment route. This is only to be
                    determined by the clinic/clinician.
                  </span>
                  <p className="extra-form-text-medium text-foreground capitalize">-{patientData?.medication?.drug_name}</p>
                </div>
              </div> */}
              {patientData?.questionnaires.map((item, index) => (
                <div
                  key={index}
                  className="pb-4 border-b border-b-grey-low mt-5"
                >
                  <div className="flex flex-col gap-3.5">
                    <span className="extra-form-text-regular text-grey">{item?.question}</span>
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
                </div>
              ))}
              <span className="extra-form-text-regular text-grey mt-5 inline-block">Signature:</span>

              {patientData?.patient?.signature ? (
                <Image
                  className="bg-grey-low md:w-[450px]"
                  src={`${import.meta.env.VITE_BASE_PATH}/storage/${patientData?.patient?.signature}`}
                />
              ) : (
                ""
              )}
            </ScrollArea.Autosize>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

export default IntakeForm;
