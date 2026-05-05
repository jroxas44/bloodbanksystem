<script setup lang="ts">
import { Plus } from "lucide-vue-next";

definePageMeta({ layout: "dashboard" });

const { data: donors, refresh } = await useFetch("/api/donors");

const formatDate = (date: string | null) => {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString();
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Donors</h1>
        <p class="text-sm text-gray-500">Manage blood donors</p>
      </div>
      <NuxtLink
        to="/donors/new"
        class="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
      >
        <Plus class="w-4 h-4" />
        Register Donor
      </NuxtLink>
    </div>

    <div class="bg-white rounded-xl border">
      <div class="p-4 border-b">
        <h2 class="font-medium text-sm">All Donors ({{ donors?.length ?? 0 }})</h2>
      </div>
      <div v-if="donors?.length" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Blood Type</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Last Donation</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="donor in donors" :key="donor.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ donor.firstName }} {{ donor.lastName }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs font-medium border border-red-200">
                  {{ donor.bloodType }}{{ donor.rhFactor }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ donor.phone }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-0.5 rounded text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-700': donor.status === 'ACTIVE',
                    'bg-gray-100 text-gray-600': donor.status === 'INACTIVE',
                    'bg-yellow-100 text-yellow-700': donor.status === 'DEFERRED',
                  }"
                >
                  {{ donor.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ formatDate(donor.lastDonation) }}</td>
              <td class="px-4 py-3">
                <NuxtLink :to="`/donors/${donor.id}`" class="text-red-600 hover:text-red-800 text-xs font-medium">
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-12 text-center text-gray-400 text-sm">
        No donors registered yet.
      </div>
    </div>
  </div>
</template>
