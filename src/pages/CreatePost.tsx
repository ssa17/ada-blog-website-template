import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState, useRef } from "react";
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
} from "lucide-react";

interface PostForm {
  title: string;
  content: string;
}

interface EditorButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  isActive?: boolean;
}

const EditorButton = ({ icon, tooltip, onClick, isActive }: EditorButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${
            isActive ? "bg-secondary text-secondary-foreground" : ""
          }`}
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default function CreatePost() {
  const { register, handleSubmit, setValue } = useForm<PostForm>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/signin");
      } else {
        setUserId(session.user.id);
      }
    };
    checkAuth();
  }, [navigate]);

  const onSubmit = async (data: PostForm) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to create a post.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("posts").insert({
        title: data.title,
        content: data.content,
        author_id: userId,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const applyStyle = (style: string, value: string | null = null) => {
    if (editorRef.current) {
      document.execCommand(style, false, value);
      const content = editorRef.current.innerHTML;
      setValue("content", content);
    }
  };

  const isActive = (style: string) => {
    return document.queryCommandState(style);
  };

  const insertLink = () => {
    const url = prompt("Enter the URL:");
    if (url) {
      applyStyle("createLink", url);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            {...register("title", { required: true })}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content
          </label>
          <div className="border rounded-lg p-2 mb-2">
            <div className="flex flex-wrap items-center gap-1">
              <div className="flex items-center gap-1">
                <EditorButton
                  icon={<Bold className="h-4 w-4" />}
                  tooltip="Bold"
                  onClick={() => applyStyle("bold")}
                  isActive={isActive("bold")}
                />
                <EditorButton
                  icon={<Italic className="h-4 w-4" />}
                  tooltip="Italic"
                  onClick={() => applyStyle("italic")}
                  isActive={isActive("italic")}
                />
                <EditorButton
                  icon={<Underline className="h-4 w-4" />}
                  tooltip="Underline"
                  onClick={() => applyStyle("underline")}
                  isActive={isActive("underline")}
                />
              </div>

              <Separator orientation="vertical" className="h-6 mx-1" />

              <div className="flex items-center gap-1">
                <EditorButton
                  icon={<List className="h-4 w-4" />}
                  tooltip="Bullet List"
                  onClick={() => applyStyle("insertUnorderedList")}
                  isActive={isActive("insertUnorderedList")}
                />
                <EditorButton
                  icon={<ListOrdered className="h-4 w-4" />}
                  tooltip="Numbered List"
                  onClick={() => applyStyle("insertOrderedList")}
                  isActive={isActive("insertOrderedList")}
                />
              </div>

              <Separator orientation="vertical" className="h-6 mx-1" />

              <div className="flex items-center gap-1">
                <EditorButton
                  icon={<IndentDecrease className="h-4 w-4" />}
                  tooltip="Decrease Indent"
                  onClick={() => applyStyle("outdent")}
                />
                <EditorButton
                  icon={<IndentIncrease className="h-4 w-4" />}
                  tooltip="Increase Indent"
                  onClick={() => applyStyle("indent")}
                />
              </div>

              <Separator orientation="vertical" className="h-6 mx-1" />

              <div className="flex items-center gap-1">
                <EditorButton
                  icon={<LinkIcon className="h-4 w-4" />}
                  tooltip="Insert Link"
                  onClick={insertLink}
                />
              </div>

              <Separator orientation="vertical" className="h-6 mx-1" />

              <div className="flex items-center gap-1">
                <EditorButton
                  icon={<Heading1 className="h-4 w-4" />}
                  tooltip="Heading 1"
                  onClick={() => applyStyle("formatBlock", "<h1>")}
                />
                <EditorButton
                  icon={<Heading2 className="h-4 w-4" />}
                  tooltip="Heading 2"
                  onClick={() => applyStyle("formatBlock", "<h2>")}
                />
                <EditorButton
                  icon={<Heading3 className="h-4 w-4" />}
                  tooltip="Heading 3"
                  onClick={() => applyStyle("formatBlock", "<h3>")}
                />
              </div>
            </div>
          </div>
          <div
            ref={editorRef}
            contentEditable
            className="w-full min-h-[200px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 prose prose-sm"
            onInput={() => {
              if (editorRef.current) {
                setValue("content", editorRef.current.innerHTML);
              }
            }}
          />
        </div>
        <Button type="submit">Create Post</Button>
      </form>
    </div>
  );
}