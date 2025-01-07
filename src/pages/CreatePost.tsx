import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState, useRef } from "react";
import { EditorToolbar } from "@/components/editor/EditorToolbar";

interface PostForm {
  title: string;
  content: string;
}

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

  const applyFormat = (command: string, value: string | null = null) => {
    document.execCommand('styleWithCSS', false, 'true');
    
    // Save the current selection
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    // Focus the editor before applying the command
    if (editorRef.current) {
      editorRef.current.focus();
    }

    // Apply the formatting command
    document.execCommand(command, false, value);

    // Restore the selection if needed
    if (selection && range && !selection.rangeCount) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Update the form value with the new HTML content
    if (editorRef.current) {
      setValue("content", editorRef.current.innerHTML);
    }
  };

  const isFormatActive = (format: string) => {
    return document.queryCommandState(format);
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
          <EditorToolbar 
            onFormatText={applyFormat}
            getFormatState={isFormatActive}
          />
          <div
            ref={editorRef}
            contentEditable
            className="w-full min-h-[200px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 prose prose-sm"
            onInput={(e) => {
              setValue("content", e.currentTarget.innerHTML);
            }}
            onFocus={() => {
              document.execCommand('styleWithCSS', false, 'true');
            }}
          />
        </div>
        <Button type="submit">Create Post</Button>
      </form>
    </div>
  );
}