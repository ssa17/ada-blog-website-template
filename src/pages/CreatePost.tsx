import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState, useRef } from "react";

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

  const applyStyle = (style: string, value: string | null = null) => {
    if (editorRef.current) {
      document.execCommand(style, false, value);
      const content = editorRef.current.innerHTML;
      setValue("content", content); // Update the content field in the form
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
            <div className="space-x-2 mb-4 flex flex-wrap gap-2">
              <button
                  type="button"
                  onClick={() => applyStyle("bold")}
                  className={`p-2 rounded-md border ${isActive("bold") ? "bg-blue-400 text-white" : "bg-gray-200"}`}
              >
                B
              </button>
              <button
                  type="button"
                  onClick={() => applyStyle("italic")}
                  className={`p-2 rounded-md border ${isActive("italic") ? "bg-blue-400 text-white" : "bg-gray-200"}`}
              >
                I
              </button>
              <button
                  type="button"
                  onClick={() => applyStyle("underline")}
                  className={`p-2 rounded-md border ${isActive("underline") ? "bg-blue-400 text-white" : "bg-gray-200"}`}
              >
                U
              </button>
              <button
                  type="button"
                  onClick={() => applyStyle("insertUnorderedList")}
                  className="p-2 rounded-md border bg-gray-200"
              >
                Bullet Points
              </button>
              <button
                  type="button"
                  onClick={() => applyStyle("insertOrderedList")}
                  className="p-2 rounded-md border bg-gray-200"
              >
                Numbered List
              </button>
              <button
                  type="button"
                  onClick={() => applyStyle("outdent")}
                  className="p-2 rounded-md border bg-gray-200"
              >
                Outdent
              </button>
              <button
                  type="button"
                  onClick={() => applyStyle("indent")}
                  className="p-2 rounded-md border bg-gray-200"
              >
                Indent
              </button>
              <button
                  type="button"
                  onClick={() => insertLink()}
                  className="p-2 rounded-md border bg-gray-200"
              >
                Link
              </button>
              <button
                  type="button"
                  onClick={() => applyStyle("formatBlock", "<h1>")}
                  className="p-2 rounded-md border bg-gray-200"
              >
                H1
              </button>
              <button
                  type="button"
                  onClick={() => applyStyle("formatBlock", "<h2>")}
                  className="p-2 rounded-md border bg-gray-200"
              >
                H2
              </button>
              <button
                  type="button"
                  onClick={() => applyStyle("formatBlock", "<h3>")}
                  className="p-2 rounded-md border bg-gray-200"
              >
                H3
              </button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                className="w-full min-h-[200px] p-2 border rounded-md text-gray-800 leading-relaxed"
                onInput={() => {
                  if (editorRef.current) {
                    setValue("content", editorRef.current.innerHTML);
                  }
                }}
            ></div>
          </div>
          <Button type="submit">Create Post</Button>
        </form>
      </div>
  );
}
