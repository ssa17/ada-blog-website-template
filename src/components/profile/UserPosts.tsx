import { BlogCard } from "@/components/BlogCard";
import { Tables } from "@/integrations/supabase/types";

type Post = Tables<"posts"> & {
  profiles: {
    username: string;
  } | null;
};

export function UserPosts({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Posts</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      {(!posts || posts.length === 0) && (
        <p className="text-muted-foreground">You haven't created any posts yet.</p>
      )}
    </div>
  );
}