<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

const { addToast } = useToast();
const router = useRouter();

const form = reactive({
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  bloodType: "",
  rhFactor: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await $fetch("/api/donors", { method: "POST", body: form });
    addToast("Donor registered successfully");
    router.push("/donors");
  } catch (e: any) {
    addToast(e?.data?.message || "Failed to register donor", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold text-gray-900 mb-1">Register New Donor</h1>
    <p class="text-sm text-gray-500 mb-6">Add a new blood donor to the system</p>

    <div class="bg-white rounded-xl border p-6">
      <h2 class="font-medium text-sm text-gray-700 mb-4">Donor Information</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input v-model="form.firstName" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input v-model="form.lastName" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input v-model="form.dateOfBirth" type="date" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select v-model="form.gender" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500">
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
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
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email" type="email" class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input v-model="form.phone" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input v-model="form.address" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input v-model="form.city" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input v-model="form.state" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
            <input v-model="form.zipCode" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {{ isSubmitting ? "Registering..." : "Register Donor" }}
          </button>
          <NuxtLink to="/donors" class="px-6 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
