<script setup lang="ts">
import { Heart, Droplets, Package, FileText } from "lucide-vue-next";

definePageMeta({ layout: "dashboard" });

const { data: stats, refresh } = await useFetch("/api/dashboard/stats");
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
    <p class="text-sm text-gray-500 mb-6">
      Welcome back, {{ useAuth().user.value?.name }}
    </p>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-500">Total Donors</span>
          <Heart class="w-4 h-4 text-red-400" />
        </div>
        <p class="text-2xl font-bold">{{ stats?.donorCount ?? 0 }}</p>
      </div>
      <div class="bg-white rounded-xl border p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-500">Total Donations</span>
          <Droplets class="w-4 h-4 text-red-400" />
        </div>
        <p class="text-2xl font-bold">{{ stats?.donationCount ?? 0 }}</p>
      </div>
      <div class="bg-white rounded-xl border p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-500">Blood Units Available</span>
          <Package class="w-4 h-4 text-red-400" />
        </div>
        <p class="text-2xl font-bold">{{ stats?.totalUnits ?? 0 }}</p>
      </div>
      <div class="bg-white rounded-xl border p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-500">Pending Requests</span>
          <FileText class="w-4 h-4 text-red-400" />
        </div>
        <p class="text-2xl font-bold">{{ stats?.pendingRequests ?? 0 }}</p>
      </div>
    </div>

    <!-- Blood Inventory + Recent Donations -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl border p-5">
        <h2 class="font-semibold text-gray-900 mb-4">Blood Inventory</h2>
        <div class="grid grid-cols-4 gap-3">
          <div
            v-for="item in stats?.inventory"
            :key="item.id"
            class="text-center p-3 bg-gray-50 rounded-lg"
          >
            <p class="text-xs text-gray-500">{{ item.bloodType }}{{ item.rhFactor }}</p>
            <p
              class="text-xl font-bold"
              :class="item.unitsAvailable < item.minimumStock ? 'text-red-600' : 'text-green-600'"
            >
              {{ item.unitsAvailable }}
            </p>
            <p class="text-xs text-gray-400">units</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border p-5">
        <h2 class="font-semibold text-gray-900 mb-4">Recent Donations</h2>
        <div v-if="stats?.recentDonations?.length" class="space-y-3">
          <div
            v-for="donation in stats.recentDonations"
            :key="donation.id"
            class="flex items-center justify-between text-sm"
          >
            <span class="text-gray-700">
              {{ donation.donor.firstName }} {{ donation.donor.lastName }}
            </span>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-gray-100 rounded text-xs">
                {{ donation.bloodType }}{{ donation.rhFactor }}
              </span>
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
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400 text-center py-4">No donations yet.</p>
      </div>
    </div>
  </div>
</template>
