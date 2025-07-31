import { IDocumentsRef } from "@/common/api/models/interfaces/Prescription.model";
import { Link } from "react-router-dom";

// const documents = [
//   {
//     icon: "icon-pdf",
//     documentText: "Sofia prescription.pdf",
//     documentView: "View",
//     documentIcon: "icon-download-04",
//   },
//   {
//     icon: "icon-pdf",
//     documentText: "Sofia prescription.pdf",
//     documentView: "View",
//     documentIcon: "icon-download-04",
//   },
//   {
//     icon: "icon-pdf",
//     documentText: "Sofia prescription.pdf sdf",
//     documentView: "View",
//     documentIcon: "icon-download-04",
//   },
//   {
//     icon: "icon-pdf",
//     documentText: "Sofia prescription.pdf",
//     documentView: "View",
//     documentIcon: "icon-download-04",
//   },
// ];

function DocumentList({ documents }: { documents: IDocumentsRef[] }) {
  return (
    <ul className="max-w-[716px] flex flex-col gap-3 divide-y divide-grey-low">
      {documents.map((item, index) => (
        <li
          key={index}
          className="flex pt-3"
        >
          <div className="flex items-center gap-3.5">
            <i className={`icon-pdf ${item.type ? item.type : ""}`}></i>
            <span className="extra-text-medium text-grey-medium">{item?.type}</span>
          </div>
          <div className="ml-auto flex items-center gap-8">
            <Link
              to={`${import.meta.env.VITE_BASE_PATH}/storage/test_files/${item?.uploaded_file}`}
              className="text-primary link-text-sm font-medium underline"
              target="_blank"
            >
              View
            </Link>
            <Link to={`${import.meta.env.VITE_BASE_URL}/download-lab-test-file?prescription_doc_id=${item?.id}`}>
              <i className={`icon-download-04 cursor-pointer text-foreground`}></i>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default DocumentList;
