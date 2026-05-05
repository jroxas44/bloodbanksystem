<script setup lang="ts">
import { Plus, Trash2 } from "lucide-vue-next";

definePageMeta({ layout: "dashboard" });

const { user } = useAuth();
const { addToast } = useToast();
const { data: users, refresh } = await useFetch("/api/users");

const formatDate = (date: string) => new Date(date).toLocaleDateString();

const deleteUser = async (id: string) => {
  if (!confirm("Are you sure you want to delete this user?")) return;
  try {
    await $fetch(`/api/users/${id}`, { method: "DELETE" });
    addToast("User deleted successfully");
    await refresh();
  } catch (e: any) {
    addToast(e?.data?.message || "Failed to delete user", "error");
  }
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
        <p class="text-sm text-gray-500">Manage system users and their roles</p>
      </div>
      <NuxtLink
        to="/users/new"
        class="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
      >
        <Plus class="w-4 h-4" />
        Add User
      </NuxtLink>
    </div>

    <div class="bg-white rounded-xl border">
      <div class="p-4 border-b">
        <h2 class="font-medium text-sm">All Users ({{ users?.length ?? 0 }})</h2>
      </div>
      <div v-if="users?.length" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Email</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Role</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Created</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ u.name }}</td>
              <td class="px-4 py-3 text-gray-600">{{ u.email }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-0.5 rounded text-xs font-medium border"
                  :class="u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'"
                >
                  {{ u.role }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ formatDate(u.createdAt) }}</td>
              <td class="px-4 py-3">
                <button
                  v-if="u.id !== user?.userId"
                  @click="deleteUser(u.id)"
                  class="flex items-center gap-1 text-xs bg-red-50 text-red-700 px-3 py-1 rounded border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <Trash2 class="w-3 h-3" />
                  Delete
                </button>
                <span v-else class="text-xs text-gray-400">Current user</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
