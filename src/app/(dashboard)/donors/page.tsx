import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
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
import { Plus } from "lucide-react";

export default async function DonorsPage() {
  const donors = await prisma.donor.findMany({
    orderBy: { createdAt: "desc" },
    include: { donations: { take: 1, orderBy: { donationDate: "desc" } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Donors</h1>
          <p className="text-muted-foreground">Manage blood donor records</p>
        </div>
        <Link href="/donors/new">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="mr-2 h-4 w-4" />
            Register Donor
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Donors ({donors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {donors.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No donors registered yet. Click &quot;Register Donor&quot; to add one.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Donation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donors.map((donor) => (
                  <TableRow key={donor.id}>
                    <TableCell className="font-medium">
                      {donor.firstName} {donor.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {donor.bloodType}{donor.rhFactor}
                      </Badge>
                    </TableCell>
                    <TableCell>{donor.phone}</TableCell>
                    <TableCell>
                      <StatusBadge status={donor.status} />
                    </TableCell>
                    <TableCell>
                      {donor.lastDonation
                        ? new Date(donor.lastDonation).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <Link href={`/donors/${donor.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-800",
    DEFERRED: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
}
