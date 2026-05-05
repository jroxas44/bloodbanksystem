<script setup lang="ts">
import { Droplets } from "lucide-vue-next";

definePageMeta({ layout: "default" });

const { login } = useAuth();
const { addToast } = useToast();

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const handleSubmit = async () => {
  error.value = "";
  isLoading.value = true;
  try {
    await login(email.value, password.value);
    addToast("Logged in successfully");
    navigateTo("/dashboard");
  } catch (e: any) {
    error.value = e?.data?.message || "Invalid email or password";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-sm bg-white rounded-xl shadow-sm border p-8">
      <div class="text-center mb-6">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Droplets class="w-6 h-6 text-red-500" />
        </div>
        <h1 class="text-xl font-bold text-gray-900">BloodBank Manager</h1>
        <p class="text-sm text-gray-500">Sign in to manage blood bank operations</p>
      </div>

      <div
        v-if="error"
        class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg"
      >
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {{ isLoading ? "Signing in..." : "Sign In" }}
        </button>
      </form>

      <div class="mt-6 pt-4 border-t text-xs text-gray-500">
        <p class="font-medium mb-1">Demo Credentials:</p>
        <p>Admin: admin@bloodbank.com / admin123</p>
        <p>Clerk: clerk@bloodbank.com / clerk123</p>
      </div>
    </div>
  </div>
</template>
