<script setup lang="ts">
import {
  LayoutDashboard,
  Heart,
  Droplets,
  Package,
  FileText,
  Users,
  LogOut,
} from "lucide-vue-next";

const { user, logout, isAdmin } = useAuth();
const route = useRoute();

const navItems = computed(() => {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Donors", icon: Heart, to: "/donors" },
    { label: "Donations", icon: Droplets, to: "/donations" },
    { label: "Inventory", icon: Package, to: "/inventory" },
    { label: "Requests", icon: FileText, to: "/requests" },
  ];
  if (isAdmin.value) {
    items.push({ label: "User Management", icon: Users, to: "/users" });
  }
  return items;
});

const isActive = (path: string) => route.path === path || route.path.startsWith(path + "/");
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <Droplets class="w-4 h-4 text-red-600" />
          </div>
          <div>
            <h1 class="font-bold text-sm text-gray-900">BloodBank</h1>
            <p class="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 p-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition-colors"
          :class="
            isActive(item.to)
              ? 'bg-red-50 text-red-700 font-medium'
              : 'text-gray-600 hover:bg-gray-100'
          "
        >
          <component :is="item.icon" class="w-4 h-4" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="p-3 border-t border-gray-200">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
            {{ user?.name?.split(' ').map((n: string) => n[0]).join('') }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ user?.name }}</p>
            <p class="text-xs text-gray-500">{{ user?.role === 'ADMIN' ? 'Administrator' : 'Clerk' }}</p>
          </div>
        </div>
        <button
          @click="logout"
          class="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100 transition-colors"
        >
          <LogOut class="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-6">
      <slot />
    </main>
  </div>
</template>
