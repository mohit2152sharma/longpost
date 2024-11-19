import { useEditor, EditorContent, EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextEditorMenuBar from "./editor-menu";


type TextEditorProps = {
  onChange: (content: string) => void;
  initialContent?: string; // Add this line
};


export default function RichTextEditor({
  onChange,
  // initialContent,
}: TextEditorProps) {

  const editor = useEditor({
    extensions: [StarterKit.configure({ bulletList: { keepMarks: true }, orderedList: { keepMarks: true } }), Underline],
    content: '',
    // content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: " prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc min-h-[150px] cursor-text rounded-md border p-5 ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 "
      }
    },
    immediatelyRender: false
  })
  return (
    <div>
      {/* <EditorProvider slotBefore{<TextEditorMenuBar editor={editor}/>} extensions=extensions> */}
      <TextEditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
