<script setup lang="ts">
import { Plus } from "lucide-vue-next";

definePageMeta({ layout: "dashboard" });

const { addToast } = useToast();
const { data: requests, refresh } = await useFetch("/api/requests");

const formatDate = (date: string) => new Date(date).toLocaleDateString();

const updateStatus = async (id: string, status: string) => {
  try {
    await $fetch("/api/requests", { method: "PATCH", body: { id, status } });
    addToast(status === "FULFILLED" ? "Request fulfilled" : `Request ${status.toLowerCase()}`);
    await refresh();
  } catch (e: any) {
    addToast(e?.data?.message || "Failed to update request", "error");
  }
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Blood Requests</h1>
        <p class="text-sm text-gray-500">Manage blood requests from hospitals</p>
      </div>
      <NuxtLink
        to="/requests/new"
        class="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
      >
        <Plus class="w-4 h-4" />
        New Request
      </NuxtLink>
    </div>

    <div class="bg-white rounded-xl border">
      <div class="p-4 border-b">
        <h2 class="font-medium text-sm">All Requests ({{ requests?.length ?? 0 }})</h2>
      </div>
      <div v-if="requests?.length" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Patient</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Blood Type</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Units</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Urgency</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Hospital</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Requested By</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="req in requests" :key="req.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ req.patientName }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs font-medium border border-red-200">
                  {{ req.bloodType }}{{ req.rhFactor }}
                </span>
              </td>
              <td class="px-4 py-3">{{ req.unitsRequested }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-0.5 rounded text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-700': req.urgency === 'NORMAL',
                    'bg-yellow-100 text-yellow-700': req.urgency === 'URGENT',
                    'bg-red-100 text-red-700': req.urgency === 'EMERGENCY',
                  }"
                >
                  {{ req.urgency }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ req.hospitalName }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-0.5 rounded text-xs font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-700': req.status === 'PENDING',
                    'bg-blue-100 text-blue-700': req.status === 'APPROVED',
                    'bg-green-100 text-green-700': req.status === 'FULFILLED',
                    'bg-red-100 text-red-700': req.status === 'REJECTED',
                  }"
                >
                  {{ req.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ req.requestedBy }}</td>
              <td class="px-4 py-3">
                <div v-if="req.status === 'PENDING'" class="flex gap-2">
                  <button
                    @click="updateStatus(req.id, 'FULFILLED')"
                    class="text-xs bg-green-50 text-green-700 px-3 py-1 rounded border border-green-200 hover:bg-green-100"
                  >
                    Fulfill
                  </button>
                  <button
                    @click="updateStatus(req.id, 'REJECTED')"
                    class="text-xs bg-red-50 text-red-700 px-3 py-1 rounded border border-red-200 hover:bg-red-100"
                  >
                    Reject
                  </button>
                </div>
                <span v-else class="text-xs text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-12 text-center text-gray-400 text-sm">
        No blood requests yet.
      </div>
    </div>
  </div>
</template>
