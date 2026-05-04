"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function UserActions({
  userId,
  currentUserId,
}: {
  userId: string;
  currentUserId: string;
}) {
  const router = useRouter();

  if (userId === currentUserId) {
    return <span className="text-xs text-muted-foreground">Current user</span>;
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users?id=${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete");
      }

      toast.success("User deleted successfully");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-red-600 hover:bg-red-50"
      onClick={handleDelete}
    >
      <Trash2 className="mr-1 h-3 w-3" />
      Delete
    </Button>
  );
}
