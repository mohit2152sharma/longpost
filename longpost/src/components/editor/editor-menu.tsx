import { Bold, Italic, Strikethrough, ListOrdered, List, Underline } from 'lucide-react';
import { Editor  } from "@tiptap/react";
import { Button } from '~/components/ui/button'


const MenuButton = ({
  onClick,
  isActive,
  disabled,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <Button
    variant={isActive ? "default" as const : "secondary" as const}
    onClick={onClick}
    disabled={disabled}
    type="button"
  >{children}</Button>
);

export default function TextEditorMenuBar({
  editor, }: { editor: Editor | null; }) {
  if (!editor) return null;
  // const TextEditorMenu = () => {
  //   const { editor } = useCurrentEditor();

  if (!editor) return null;

  const buttons = [
    {
      icon: <Bold className="size-5" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: <Underline className="size-5" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
    },
    {
      icon: <Italic className="size-5" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-5" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
    },
    {
      icon: <List className="size-5" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      disabled: !editor.can().chain().focus().toggleBulletList().run(),
    },
    {
      icon: <ListOrdered className="size-5" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      disabled: !editor.can().chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <div className="mb-2 flex space-x-2">
      {buttons.map(({ icon, onClick, isActive, disabled }, index) => (
        <MenuButton
          key={index}
          onClick={onClick}
          isActive={isActive}
          disabled={disabled}
        >
          {icon}
        </MenuButton>
      ))}
    </div>
  );
}
