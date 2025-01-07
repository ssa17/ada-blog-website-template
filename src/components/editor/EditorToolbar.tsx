import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  ListOrdered,
  List,
  IndentIncrease,
  IndentDecrease,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Type,
} from "lucide-react";
import { EditorButton } from "./EditorButton";

interface EditorToolbarProps {
  onFormatText: (command: string, value?: string | null) => void;
  getFormatState: (format: string) => boolean;
}

export const EditorToolbar = ({ onFormatText, getFormatState }: EditorToolbarProps) => {
  return (
    <div className="border rounded-lg p-2 mb-2">
      <div className="flex flex-wrap items-center gap-1">
        <div className="flex items-center gap-1">
          <EditorButton
            icon={<Bold className="h-4 w-4" />}
            tooltip="Bold"
            onClick={() => onFormatText("bold")}
            isActive={getFormatState("bold")}
          />
          <EditorButton
            icon={<Italic className="h-4 w-4" />}
            tooltip="Italic"
            onClick={() => onFormatText("italic")}
            isActive={getFormatState("italic")}
          />
          <EditorButton
            icon={<Underline className="h-4 w-4" />}
            tooltip="Underline"
            onClick={() => onFormatText("underline")}
            isActive={getFormatState("underline")}
          />
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-1">
          <EditorButton
            icon={<Type className="h-4 w-4" />}
            tooltip="Normal Text"
            onClick={() => onFormatText("formatBlock", "p")}
          />
          <EditorButton
            icon={<Heading1 className="h-4 w-4" />}
            tooltip="Heading 1"
            onClick={() => onFormatText("formatBlock", "h1")}
          />
          <EditorButton
            icon={<Heading2 className="h-4 w-4" />}
            tooltip="Heading 2"
            onClick={() => onFormatText("formatBlock", "h2")}
          />
          <EditorButton
            icon={<Heading3 className="h-4 w-4" />}
            tooltip="Heading 3"
            onClick={() => onFormatText("formatBlock", "h3")}
          />
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-1">
          <EditorButton
            icon={<List className="h-4 w-4" />}
            tooltip="Bullet List"
            onClick={() => onFormatText("insertUnorderedList")}
            isActive={getFormatState("insertUnorderedList")}
          />
          <EditorButton
            icon={<ListOrdered className="h-4 w-4" />}
            tooltip="Numbered List"
            onClick={() => onFormatText("insertOrderedList")}
            isActive={getFormatState("insertOrderedList")}
          />
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-1">
          <EditorButton
            icon={<IndentDecrease className="h-4 w-4" />}
            tooltip="Decrease Indent"
            onClick={() => onFormatText("outdent")}
          />
          <EditorButton
            icon={<IndentIncrease className="h-4 w-4" />}
            tooltip="Increase Indent"
            onClick={() => onFormatText("indent")}
          />
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-1">
          <EditorButton
            icon={<LinkIcon className="h-4 w-4" />}
            tooltip="Insert Link"
            onClick={() => {
              const url = prompt("Enter the URL:");
              if (url) onFormatText("createLink", url);
            }}
          />
        </div>
      </div>
    </div>
  );
};