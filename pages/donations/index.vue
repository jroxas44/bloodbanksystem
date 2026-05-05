<script setup lang="ts">
import { Plus } from "lucide-vue-next";

definePageMeta({ layout: "dashboard" });

const { addToast } = useToast();
const { data: donations, refresh } = await useFetch("/api/donations");

const formatDate = (date: string) => new Date(date).toLocaleDateString();

const nextStatus = (status: string) => {
  if (status === "COLLECTED") return "TESTED";
  if (status === "TESTED") return "APPROVED";
  return null;
};

const updateStatus = async (id: string, status: string) => {
  try {
    await $fetch("/api/donations", { method: "PATCH", body: { id, status } });
    addToast(`Status updated to ${status}`);
    await refresh();
  } catch (e: any) {
    addToast(e?.data?.message || "Failed to update status", "error");
  }
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Donations</h1>
        <p class="text-sm text-gray-500">Track blood donations</p>
      </div>
      <NuxtLink
        to="/donations/new"
        class="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
      >
        <Plus class="w-4 h-4" />
        Record Donation
      </NuxtLink>
    </div>

    <div class="bg-white rounded-xl border">
      <div class="p-4 border-b">
        <h2 class="font-medium text-sm">All Donations ({{ donations?.length ?? 0 }})</h2>
      </div>
      <div v-if="donations?.length" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Donor</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Blood Type</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Volume</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="donation in donations" :key="donation.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">
                {{ donation.donor.firstName }} {{ donation.donor.lastName }}
              </td>
              <td class="px-4 py-3 text-gray-600">{{ formatDate(donation.donationDate) }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs font-medium border border-red-200">
                  {{ donation.bloodType }}{{ donation.rhFactor }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ donation.volumeMl }} mL</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-0.5 rounded text-xs font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-700': donation.status === 'COLLECTED',
                    'bg-blue-100 text-blue-700': donation.status === 'TESTED',
                    'bg-green-100 text-green-700': donation.status === 'APPROVED',
                    'bg-red-100 text-red-700': donation.status === 'REJECTED',
                  }"
                >
                  {{ donation.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <button
                  v-if="nextStatus(donation.status)"
                  @click="updateStatus(donation.id, nextStatus(donation.status)!)"
                  class="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  Mark as {{ nextStatus(donation.status) }}
                </button>
                <span v-else class="text-xs text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-12 text-center text-gray-400 text-sm">
        No donations recorded yet.
      </div>
    </div>
  </div>
</template>
