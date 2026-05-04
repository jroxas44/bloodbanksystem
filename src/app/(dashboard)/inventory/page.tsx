import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryActions } from "./inventory-actions";

export default async function InventoryPage() {
  const inventory = await prisma.bloodInventory.findMany({
    orderBy: [{ bloodType: "asc" }, { rhFactor: "asc" }],
  });

  const totalUnits = inventory.reduce((sum, inv) => sum + inv.unitsAvailable, 0);
  const lowStock = inventory.filter((inv) => inv.unitsAvailable <= inv.minimumStock);
  const criticalStock = inventory.filter((inv) => inv.unitsAvailable === 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Blood Inventory</h1>
        <p className="text-muted-foreground">Monitor and manage blood stock levels</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{totalUnits}</div>
          </CardContent>
        </Card>
        <Card className={lowStock.length > 0 ? "border-yellow-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{lowStock.length}</div>
          </CardContent>
        </Card>
        <Card className={criticalStock.length > 0 ? "border-red-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{criticalStock.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-4 md:grid-cols-8">
        {inventory.map((inv) => {
          const isLow = inv.unitsAvailable <= inv.minimumStock;
          const isEmpty = inv.unitsAvailable === 0;
          return (
            <Card
              key={inv.id}
              className={
                isEmpty
                  ? "border-red-300 bg-red-50"
                  : isLow
                    ? "border-yellow-300 bg-yellow-50"
                    : ""
              }
            >
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold">
                  {inv.bloodType}{inv.rhFactor}
                </div>
                <div className="text-3xl font-bold mt-1 text-red-600">
                  {inv.unitsAvailable}
                </div>
                <div className="text-xs text-muted-foreground">units</div>
                {isLow && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {isEmpty ? "Empty" : "Low"}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blood Type</TableHead>
                <TableHead>Units Available</TableHead>
                <TableHead>Minimum Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono font-bold">
                    {inv.bloodType}{inv.rhFactor}
                  </TableCell>
                  <TableCell className="text-lg font-bold">{inv.unitsAvailable}</TableCell>
                  <TableCell>{inv.minimumStock}</TableCell>
                  <TableCell>
                    {inv.unitsAvailable === 0 ? (
                      <Badge variant="destructive">Out of Stock</Badge>
                    ) : inv.unitsAvailable <= inv.minimumStock ? (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low Stock</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(inv.lastUpdated).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <InventoryActions inventory={inv} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
