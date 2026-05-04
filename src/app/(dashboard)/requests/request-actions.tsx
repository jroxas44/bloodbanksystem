"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function RequestActions({
  requestId,
  currentStatus,
}: {
  requestId: string;
  currentStatus: string;
}) {
  const router = useRouter();

  if (currentStatus !== "PENDING") {
    return <span className="text-xs text-muted-foreground">-</span>;
  }

  async function updateStatus(status: string) {
    try {
      const res = await fetch("/api/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update");
      }

      toast.success(`Request ${status.toLowerCase()}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update request");
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="text-green-700 border-green-300 hover:bg-green-50"
        onClick={() => updateStatus("FULFILLED")}
      >
        Fulfill
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-red-700 border-red-300 hover:bg-red-50"
        onClick={() => updateStatus("REJECTED")}
      >
        Reject
      </Button>
    </div>
  );
}
