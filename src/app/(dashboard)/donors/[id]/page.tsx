import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";

export default async function DonorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const donor = await prisma.donor.findUnique({
    where: { id },
    include: { donations: { orderBy: { donationDate: "desc" } } },
  });

  if (!donor) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/donors">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {donor.firstName} {donor.lastName}
          </h1>
          <p className="text-muted-foreground">Donor Profile</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Blood Type" value={`${donor.bloodType}${donor.rhFactor}`} />
            <InfoRow label="Gender" value={donor.gender} />
            <InfoRow label="Date of Birth" value={new Date(donor.dateOfBirth).toLocaleDateString()} />
            <InfoRow label="Phone" value={donor.phone} />
            <InfoRow label="Email" value={donor.email || "N/A"} />
            <InfoRow label="Address" value={`${donor.address}, ${donor.city}, ${donor.state} ${donor.zipCode}`} />
            <InfoRow label="Status" value={donor.status} />
            <InfoRow
              label="Last Donation"
              value={donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : "Never"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <div className="text-3xl font-bold text-red-600">{donor.donations.length}</div>
                <div className="text-sm text-muted-foreground">Total Donations</div>
              </div>
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {donor.donations.reduce((sum, d) => sum + d.volumeMl, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total mL Donated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          {donor.donations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No donations recorded yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Volume (mL)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Collected By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donor.donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      {new Date(donation.donationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {donation.bloodType}{donation.rhFactor}
                      </Badge>
                    </TableCell>
                    <TableCell>{donation.volumeMl}</TableCell>
                    <TableCell>
                      <Badge
                        variant={donation.status === "APPROVED" ? "default" : "outline"}
                      >
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{donation.collectedBy}</TableCell>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
