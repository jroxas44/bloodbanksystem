<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

const route = useRoute();
const { data: donor } = await useFetch(`/api/donors/${route.params.id}`);

const formatDate = (date: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};
</script>

<template>
  <div class="max-w-3xl" v-if="donor">
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/donors" class="text-gray-400 hover:text-gray-600 text-sm">&larr; Back to Donors</NuxtLink>
    </div>

    <div class="bg-white rounded-xl border p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-gray-900">{{ donor.firstName }} {{ donor.lastName }}</h1>
        <span class="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200">
          {{ donor.bloodType }}{{ donor.rhFactor }}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div><span class="text-gray-500">Gender:</span> {{ donor.gender }}</div>
        <div><span class="text-gray-500">Date of Birth:</span> {{ formatDate(donor.dateOfBirth) }}</div>
        <div><span class="text-gray-500">Email:</span> {{ donor.email || 'N/A' }}</div>
        <div><span class="text-gray-500">Phone:</span> {{ donor.phone }}</div>
        <div><span class="text-gray-500">Address:</span> {{ donor.address }}, {{ donor.city }}, {{ donor.state }} {{ donor.zipCode }}</div>
        <div><span class="text-gray-500">Status:</span>
          <span class="px-2 py-0.5 rounded text-xs font-medium ml-1"
            :class="{
              'bg-green-100 text-green-700': donor.status === 'ACTIVE',
              'bg-gray-100 text-gray-600': donor.status === 'INACTIVE',
              'bg-yellow-100 text-yellow-700': donor.status === 'DEFERRED',
            }">{{ donor.status }}</span>
        </div>
        <div><span class="text-gray-500">Last Donation:</span> {{ formatDate(donor.lastDonation) }}</div>
      </div>
    </div>

    <div class="bg-white rounded-xl border">
      <div class="p-4 border-b">
        <h2 class="font-medium text-sm">Donation History ({{ donor.donations?.length ?? 0 }})</h2>
      </div>
      <div v-if="donor.donations?.length" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Volume</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Collected By</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="d in donor.donations" :key="d.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">{{ formatDate(d.donationDate) }}</td>
              <td class="px-4 py-3">{{ d.volumeMl }} mL</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded text-xs font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-700': d.status === 'COLLECTED',
                    'bg-blue-100 text-blue-700': d.status === 'TESTED',
                    'bg-green-100 text-green-700': d.status === 'APPROVED',
                    'bg-red-100 text-red-700': d.status === 'REJECTED',
                  }">{{ d.status }}</span>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ d.collectedBy }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-8 text-center text-gray-400 text-sm">No donations recorded.</div>
    </div>
  </div>
</template>
