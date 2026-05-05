<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

const { addToast } = useToast();
const router = useRouter();

const form = reactive({
  patientName: "",
  patientAge: "",
  bloodType: "",
  rhFactor: "",
  unitsRequested: "1",
  urgency: "NORMAL",
  hospitalName: "",
  doctorName: "",
  notes: "",
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await $fetch("/api/requests", { method: "POST", body: form });
    addToast("Blood request created successfully");
    router.push("/requests");
  } catch (e: any) {
    addToast(e?.data?.message || "Failed to create request", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-xl">
    <h1 class="text-2xl font-bold text-gray-900 mb-1">New Blood Request</h1>
    <p class="text-sm text-gray-500 mb-6">Create a blood request for a patient</p>

    <div class="bg-white rounded-xl border p-6">
      <h2 class="font-medium text-sm text-gray-700 mb-4">Request Details</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
            <input v-model="form.patientName" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Patient Age</label>
            <input v-model="form.patientAge" type="number" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
            <select v-model="form.bloodType" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500">
              <option value="">Select</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rh Factor</label>
            <select v-model="form.rhFactor" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500">
              <option value="">Select</option>
              <option value="+">Positive (+)</option>
              <option value="-">Negative (-)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Units Needed</label>
            <input v-model="form.unitsRequested" type="number" min="1" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
          <select v-model="form.urgency" class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500">
            <option value="NORMAL">NORMAL</option>
            <option value="URGENT">URGENT</option>
            <option value="EMERGENCY">EMERGENCY</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
            <input v-model="form.hospitalName" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
            <input v-model="form.doctorName" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
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
            {{ isSubmitting ? "Creating..." : "Create Request" }}
          </button>
          <NuxtLink to="/requests" class="px-6 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
