import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

type TextEditorProps = {
  onChange: (content: string) => void;
  initialContent?: string;
};

export default function RichTextEditor({ onChange }: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      onChange(editor.view.dom.innerText);
    },
    editorProps: {
      attributes: {
        class:
          " prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc min-h-[150px] cursor-text rounded-md border p-5 ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ",
      },
    },
    immediatelyRender: false,
  });
  return (
    <div>
      {/* NOTE: Disabled as bsky doesn't support bold/italic formatting at the moment */}
      {/* Reference: https://github.com/bluesky-social/atproto/tree/main/packages/api#rich-text */}
      {/* <TextEditorMenuBar editor={editor} /> */}
      <EditorContent editor={editor} />
    </div>
  );
}
