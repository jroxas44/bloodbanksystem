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
import { RequestActions } from "./request-actions";

export default async function RequestsPage() {
  const requests = await prisma.bloodRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blood Requests</h1>
          <p className="text-muted-foreground">Manage blood requests from hospitals</p>
        </div>
        <Link href="/requests/new">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No blood requests yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.patientName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {request.bloodType}{request.rhFactor}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.unitsRequested}</TableCell>
                    <TableCell>
                      <UrgencyBadge urgency={request.urgency} />
                    </TableCell>
                    <TableCell>{request.hospitalName}</TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell>{request.requestedBy}</TableCell>
                    <TableCell>
                      <RequestActions requestId={request.id} currentStatus={request.status} />
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
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-blue-100 text-blue-800",
    FULFILLED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}

function UrgencyBadge({ urgency }: { urgency: string }) {
  const colors: Record<string, string> = {
    NORMAL: "bg-blue-100 text-blue-800",
    URGENT: "bg-orange-100 text-orange-800",
    EMERGENCY: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[urgency] || "bg-gray-100 text-gray-800"}`}>
      {urgency}
    </span>
  );
}
