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
import { DonationActions } from "./donation-actions";

export default async function DonationsPage() {
  const donations = await prisma.donation.findMany({
    orderBy: { donationDate: "desc" },
    include: { donor: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Donations</h1>
          <p className="text-muted-foreground">Track and manage blood donations</p>
        </div>
        <Link href="/donations/new">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="mr-2 h-4 w-4" />
            Record Donation
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Donations ({donations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No donations recorded yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Collected By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">
                      {donation.donor.firstName} {donation.donor.lastName}
                    </TableCell>
                    <TableCell>
                      {new Date(donation.donationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {donation.bloodType}{donation.rhFactor}
                      </Badge>
                    </TableCell>
                    <TableCell>{donation.volumeMl} mL</TableCell>
                    <TableCell>
                      <StatusBadge status={donation.status} />
                    </TableCell>
                    <TableCell>{donation.collectedBy}</TableCell>
                    <TableCell>
                      <DonationActions donationId={donation.id} currentStatus={donation.status} />
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
    COLLECTED: "bg-blue-100 text-blue-800",
    TESTED: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    EXPIRED: "bg-gray-100 text-gray-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}
