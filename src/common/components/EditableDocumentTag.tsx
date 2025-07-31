import { Anchor } from "@mantine/core";
import { useState } from "react";

interface EditableDocumentTagProps {
  leftIconClass?: string;
  removable?: boolean;
  editable?: boolean;
  viewLink?: string;
  docName: string;
  onRename?: (name: string, extension?: string) => void;
  onRemove?: () => void;
}

const EditableDocumentTag = ({
  leftIconClass = "icon-pdf",
  viewLink = "",
  docName = "",
  removable = false,
  editable = false,
  onRename = () => {},
  onRemove = () => {},
}: EditableDocumentTagProps) => {
  const [editing, setEditing] = useState<boolean>();
  const [newName, setNewName] = useState<string>(docName.split(".").slice(0, -1).join("."));
  const [extension] = useState<string>(docName.split(".").slice(-1).join(""));
  const handleRename = () => {
    onRename(newName, extension);
    setEditing(false);
  };

  return (
    <div
      className={`${
        editing ? "" : "bg-tag-bg border-tag-bg"
      } flex items-center flex-nowrap border text-foreground extra-form-text-regular px-3 py-[7px] rounded-lg`}
    >
      {leftIconClass ? <i className={`${leftIconClass ? leftIconClass : "icon-pdf"} text-xl/none me-2.5`}></i> : ""}

      {editing ? (
        <input
          type="text"
          className="w-full min-w-max border-0 bg-transparent h-auto outline-none extra-form-text-regular"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      ) : viewLink ? (
        <Anchor
          href={viewLink ? viewLink : ""}
          target="_blank"
          underline="never"
          variant="text"
          c="foreground"
          className="extra-form-text-regular"
        >
          {docName}
        </Anchor>
      ) : (
        docName
      )}

      {editable ? (
        editing ? (
          <div className="flex items-center gap-2 ms-3">
            <i
              className="icon-checkmark-circle text-xl/none text-green-deep cursor-pointer"
              onClick={handleRename}
            ></i>
            <i
              className="icon-cross text-xl/none text-danger cursor-pointer"
              onClick={() => setEditing(false)}
            ></i>
          </div>
        ) : (
          <i
            className="icon-pencil-edit cursor-pointer text-xl/none ms-3"
            onClick={() => setEditing(true)}
          ></i>
        )
      ) : (
        ""
      )}

      {removable ? (
        <i
          className="icon-cross1 cursor-pointer text-xl/none ms-3"
          onClick={onRemove}
        ></i>
      ) : (
        ""
      )}
    </div>
  );
};

export default EditableDocumentTag;
