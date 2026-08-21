import { Button, Modal } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";

export type LabOptionId = "preferred-lab" | "upload-results" | "dosevana-lab";
export type LabSubmissionType = "preferred_lab" | "own_lab" | "dosevana_lab";

export type LabExamination = {
  name?: string;
  code?: string;
};

export type LabOption = {
  id: LabOptionId;
  title: string;
  description: string[];
  submissionType: LabSubmissionType;
};

interface LabTypeSectionModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: () => void;
  draftSelection: LabOptionId;
  onSelect: (value: LabOptionId) => void;
  examinations: LabExamination[];
  options: LabOption[];
}

function LabTypeSectionModal({ opened, onClose, onSave, draftSelection, onSelect, examinations, options }: LabTypeSectionModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
      size={"900px"}
      padding={0}
      radius="lg"
    >
      <Modal.Header className="md:!px-4 !px-0">
        <h2 className="text-2xl lg:text-4xl xl:text-5xl !font-poppins !font-bold">Select Lab Option</h2>
        <i
          className="icon-cross1 text-2xl/none cursor-pointer text-primary"
          onClick={onClose}
        ></i>
      </Modal.Header>
      <div className="bg-white md:px-4 px-0">
        <div className="border-b border-[#1F4A63]">
          <p className="text-xl lg:text-2xl xl:text-3xl font-medium text-foreground">Tests Needed for Your Lab Work</p>
          <div className="my-6 flex flex-wrap gap-2">
            {examinations.map((exam, index) => (
              <span
                key={`${exam.name || exam.code || "exam"}-${index}`}
                className="inline-flex h-8 items-center rounded-[9px] bg-[#E1DCFD] px-3 text-[11px] font-semibold text-[#244155]"
              >
                {exam.name || exam.code}
              </span>
            ))}
          </div>
        </div>
        <div className="pt-6">
          <div className="grid gap-3 lg:grid-cols-2">
            {options.map((option) => {
              const isSelected = draftSelection === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSelect(option.id)}
                  className={`relative flex min-h-[236px] flex-col rounded-[10px] border px-3 py-3 text-left transition-all ${
                    isSelected ? "border-[#6848FF] bg-[#F2EFFF] shadow-none" : "border-[#EFEFEF] bg-white hover:border-[#B9D3FF]"
                  }`}
                >
                  {isSelected ? (
                    <span className="absolute -right-[10px] top-[-10px] z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <IconCircleCheckFilled
                        size={40}
                        className="text-[#0F9D58]"
                      />
                    </span>
                  ) : null}

                  <div className={`pb-2 text-center ${option.id === "dosevana-lab" ? "border-b border-primary" : "border-b border-[#EDF0F4]"}`}>
                    <h3 className="text-base/normal md:text-xl/normal font-semibold text-foreground">{option.title}</h3>
                  </div>

                  <div className="flex-1 px-2 py-3 text-center text-[12px] leading-6 text-[#8A8F97]">
                    {option.description.map((paragraph) => (
                      <p
                        className="text-base text-foreground"
                        key={paragraph}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-auto pt-2">
                    <div
                      className={`flex h-12 items-center justify-center rounded-lg text-base lg:text-lg font-medium ${isSelected ? "bg-primary text-white" : "bg-transparent border border-primary text-primary"}`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              onClick={onSave}
              size="sm-2"
              className="w-full sm:w-40"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default LabTypeSectionModal;
