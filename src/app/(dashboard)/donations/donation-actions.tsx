"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STATUS_FLOW: Record<string, string> = {
  COLLECTED: "TESTED",
  TESTED: "APPROVED",
};

export function DonationActions({
  donationId,
  currentStatus,
}: {
  donationId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const nextStatus = STATUS_FLOW[currentStatus];

  if (!nextStatus) return <span className="text-xs text-muted-foreground">-</span>;

  async function updateStatus() {
    try {
      const res = await fetch("/api/donations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: donationId, status: nextStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success(`Status updated to ${nextStatus}`);
      router.refresh();
    } catch {
      toast.error("Failed to update donation status");
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={updateStatus}>
      Mark as {nextStatus}
    </Button>
  );
}
