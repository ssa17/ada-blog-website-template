import { Tables } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";

type Post = Tables<"posts"> & {
  profiles: {
    username: string;
  } | null;
};

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2">
          <Link to={`/posts/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="line-clamp-3 text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          By {post.profiles?.username || "Unknown"}
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  );
}