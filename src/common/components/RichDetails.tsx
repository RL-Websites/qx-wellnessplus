import { Link, RichTextEditor } from "@mantine/tiptap";
import "@mantine/tiptap/styles.css";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useEffect, useState } from "react";

interface RichDetailsProps {
  value?: string;
  placeholder?: string;
  height?: string;
  onChange: (val) => void;
}
const RichDetails = forwardRef(function ({ value = "", placeholder = "", height = "200px", onChange }: RichDetailsProps, ref) {
  const [initialState, setInitialState] = useState<boolean>(true);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder }),
    ],
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl min-h-[${height}]`,
      },
    },
    content: value,
    onUpdate: ({ editor }) => {
      setInitialState(false);
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (initialState === true) {
      console.log(initialState);
      if (editor && value) {
        editor.commands.setContent(value);
        setInitialState(false);
      }
    }
  }, [value, editor, initialState]);

  return (
    <RichTextEditor
      editor={editor}
      variant="subtle"
    >
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
});

export default RichDetails;
