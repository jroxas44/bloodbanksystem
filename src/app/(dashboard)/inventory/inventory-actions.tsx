"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface InventoryItem {
  id: string;
  bloodType: string;
  rhFactor: string;
  unitsAvailable: number;
  minimumStock: number;
}

export function InventoryActions({ inventory }: { inventory: InventoryItem }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [units, setUnits] = useState(inventory.unitsAvailable);
  const [minStock, setMinStock] = useState(inventory.minimumStock);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: inventory.id,
          unitsAvailable: units,
          minimumStock: minStock,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success(`Updated ${inventory.bloodType}${inventory.rhFactor} inventory`);
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to update inventory");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit {inventory.bloodType}{inventory.rhFactor} Inventory
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Units Available</Label>
            <Input
              type="number"
              min={0}
              value={units}
              onChange={(e) => setUnits(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Minimum Stock Level</Label>
            <Input
              type="number"
              min={0}
              value={minStock}
              onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
