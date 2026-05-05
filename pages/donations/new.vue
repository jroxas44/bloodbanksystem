<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

const { addToast } = useToast();
const router = useRouter();

const { data: donors } = await useFetch("/api/donors");

const form = reactive({
  donorId: "",
  volumeMl: "450",
  hemoglobinLevel: "",
  notes: "",
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await $fetch("/api/donations", { method: "POST", body: form });
    addToast("Donation recorded successfully");
    router.push("/donations");
  } catch (e: any) {
    addToast(e?.data?.message || "Failed to record donation", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-xl">
    <h1 class="text-2xl font-bold text-gray-900 mb-1">Record New Donation</h1>
    <p class="text-sm text-gray-500 mb-6">Record a blood donation from a registered donor</p>

    <div class="bg-white rounded-xl border p-6">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Donor</label>
          <select v-model="form.donorId" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500">
            <option value="">Select a donor</option>
            <option v-for="donor in donors" :key="donor.id" :value="donor.id">
              {{ donor.firstName }} {{ donor.lastName }} ({{ donor.bloodType }}{{ donor.rhFactor }})
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Volume (mL)</label>
            <input v-model="form.volumeMl" type="number" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hemoglobin Level</label>
            <input v-model="form.hemoglobinLevel" type="number" step="0.1" class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
          <textarea v-model="form.notes" rows="3" class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" placeholder="Any additional details..." />
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {{ isSubmitting ? "Recording..." : "Record Donation" }}
          </button>
          <NuxtLink to="/donations" class="px-6 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
