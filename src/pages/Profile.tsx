import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BlogCard } from "@/components/BlogCard";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: userPosts } = useQuery({
    queryKey: ["userPosts", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(username)")
        .eq("author_id", session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    if (username === profile?.username) {
      setUsernameAvailable(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();

      if (error) {
        console.error("Error checking username:", error);
        return;
      }

      setUsernameAvailable(data === null);
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };

  const handleUsernameChange = async () => {
    if (!usernameAvailable || !newUsername || !session?.user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username: newUsername })
        .eq("id", session.user.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Username updated",
        description: "Your username has been successfully updated.",
      });
      setNewUsername("");
      setUsernameAvailable(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update username. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !session?.user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      setNewPassword("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        session.user.id
      );

      if (deleteError) throw deleteError;

      await supabase.auth.signOut();
      queryClient.clear();
      navigate("/");
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    navigate("/signin");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Change Username</h2>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="New username"
              value={newUsername}
              onChange={(e) => {
                setNewUsername(e.target.value);
                checkUsername(e.target.value);
              }}
              className={
                usernameAvailable !== null
                  ? usernameAvailable
                    ? "border-green-500"
                    : "border-red-500"
                  : ""
              }
            />
            <Button 
              onClick={handleUsernameChange}
              disabled={loading || !usernameAvailable || !newUsername}
            >
              Update Username
            </Button>
          </div>
          {newUsername.length >= 3 && usernameAvailable !== null && (
            <p className={`text-sm ${
              usernameAvailable ? "text-green-600" : "text-red-600"
            }`}>
              {usernameAvailable
                ? "Username is available"
                : "Username is already taken"}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <div className="flex gap-4">
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button 
              onClick={handlePasswordChange}
              disabled={loading || !newPassword}
            >
              Update Password
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Posts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userPosts?.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          {userPosts?.length === 0 && (
            <p className="text-muted-foreground">You haven't created any posts yet.</p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}