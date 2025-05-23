import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

export default function Index() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(username)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  return (
    <div className="min-h-screen">
      <section className="w-full bg-secondary/50 dark:bg-secondary/10">
        <div className="container py-20">
          <h1 className="text-5xl font-bold mb-6">Welcome to ADA Blogs</h1>
          <p className="text-xl text-muted-foreground mb-8">
            The place for all your blogging needs.
          </p>
          {session ? (
            <Button asChild size="lg">
              <Link to="/posts/new">Create a post</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link to="/signin">Sign in to post</Link>
            </Button>
          )}
        </div>
      </section>

      <Separator className="my-0" />

      <section className="container py-16">
        <h2 className="text-3xl font-semibold mb-8">Latest Posts</h2>
        {isLoading ? (
          <div>Loading posts...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts?.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}