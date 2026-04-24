import { LabExamination } from "./LabTypeSectionModal";
interface LabExaminationOptionsProps {
  visibleExaminations: LabExamination[];
  isHiddenExaminationTitle?: boolean;
}

function LabExaminationOptions({ visibleExaminations, isHiddenExaminationTitle }: LabExaminationOptionsProps) {
  return (
    <div className="border-t border-[#D8DDE5] pt-4 first:border-t-0 first:pt-0 mt-5">
      {!isHiddenExaminationTitle && <h3 className="text-base font-semibold text-[#202124] sm:text-lg">Required Lab Tests</h3>}
      <p className="mt-2 max-w-5xl text-xs leading-6 text-foreground sm:text-sm md:text-lg">
        The tests listed below are required for this program and will be included in the lab requisition provided by Dosevana. The patient may take this requisition to a nearby
        laboratory to complete the required blood work.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {visibleExaminations.map((exam, index) => (
          <span
            key={`${exam.name || exam.code || "exam"}-${index}`}
            className="inline-flex items-center rounded-xl bg-[#E1DCFD] px-4 py-2 text-xs font-semibold text-[#244155] sm:text-sm"
          >
            {exam.name || exam.code}
          </span>
        ))}
      </div>
    </div>
  );
}

export default LabExaminationOptions;
