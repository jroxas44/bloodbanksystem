<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

const { addToast } = useToast();
const router = useRouter();

const form = reactive({
  name: "",
  email: "",
  password: "",
  role: "CLERK",
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await $fetch("/api/users", { method: "POST", body: form });
    addToast("User created successfully");
    router.push("/users");
  } catch (e: any) {
    addToast(e?.data?.message || "Failed to create user", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-lg">
    <h1 class="text-2xl font-bold text-gray-900 mb-1">Add New User</h1>
    <p class="text-sm text-gray-500 mb-6">Create a new system user</p>

    <div class="bg-white rounded-xl border p-6">
      <h2 class="font-medium text-sm text-gray-700 mb-4">User Information</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input v-model="form.name" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" required class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="form.password" type="password" required minlength="6" class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select v-model="form.role" class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500">
            <option value="CLERK">Clerk</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {{ isSubmitting ? "Creating..." : "Create User" }}
          </button>
          <NuxtLink to="/users" class="px-6 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
