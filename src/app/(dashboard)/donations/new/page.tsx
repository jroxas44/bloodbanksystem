"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Donor {
  id: string;
  firstName: string;
  lastName: string;
  bloodType: string;
  rhFactor: string;
  status: string;
}

export default function NewDonationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    fetch("/api/donors")
      .then((res) => res.json())
      .then((data) => setDonors(data.filter((d: Donor) => d.status === "ACTIVE")))
      .catch(() => toast.error("Failed to load donors"));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to record donation");
      }

      toast.success("Donation recorded successfully");
      router.push("/donations");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Record New Donation</h1>
        <p className="text-muted-foreground">Enter donation details below</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="donorId">Donor</Label>
              <select
                id="donorId"
                name="donorId"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="">Select a donor</option>
                {donors.map((donor) => (
                  <option key={donor.id} value={donor.id}>
                    {donor.firstName} {donor.lastName} ({donor.bloodType}{donor.rhFactor})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="volumeMl">Volume (mL)</Label>
                <Input
                  id="volumeMl"
                  name="volumeMl"
                  type="number"
                  defaultValue={450}
                  min={100}
                  max={500}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hemoglobinLevel">Hemoglobin Level (g/dL)</Label>
                <Input
                  id="hemoglobinLevel"
                  name="hemoglobinLevel"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 14.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" name="notes" placeholder="Any additional notes..." />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? "Recording..." : "Record Donation"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
