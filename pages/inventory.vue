<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

const { addToast } = useToast();
const { data: inventory, refresh } = await useFetch("/api/inventory");

const totalUnits = computed(() =>
  inventory.value?.reduce((sum, i) => sum + i.unitsAvailable, 0) ?? 0
);
const lowStockCount = computed(() =>
  inventory.value?.filter((i) => i.unitsAvailable < i.minimumStock).length ?? 0
);
const outOfStock = computed(() =>
  inventory.value?.filter((i) => i.unitsAvailable === 0).length ?? 0
);

const editingId = ref<string | null>(null);
const editForm = reactive({ unitsAvailable: 0, minimumStock: 5 });

const startEdit = (item: any) => {
  editingId.value = item.id;
  editForm.unitsAvailable = item.unitsAvailable;
  editForm.minimumStock = item.minimumStock;
};

const saveEdit = async (id: string) => {
  try {
    await $fetch("/api/inventory", {
      method: "PATCH",
      body: { id, ...editForm },
    });
    addToast("Inventory updated");
    editingId.value = null;
    await refresh();
  } catch (e: any) {
    addToast(e?.data?.message || "Failed to update", "error");
  }
};

const formatDate = (date: string) => new Date(date).toLocaleDateString();
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-1">Blood Inventory</h1>
    <p class="text-sm text-gray-500 mb-6">Monitor and manage blood stock levels</p>

    <!-- Summary Cards -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-xl border p-4">
        <p class="text-sm text-gray-500">Total Units</p>
        <p class="text-3xl font-bold text-red-600">{{ totalUnits }}</p>
      </div>
      <div class="bg-white rounded-xl border p-4">
        <p class="text-sm text-gray-500">Low Stock Types</p>
        <p class="text-3xl font-bold text-yellow-600">{{ lowStockCount }}</p>
      </div>
      <div class="bg-white rounded-xl border p-4">
        <p class="text-sm text-gray-500">Out of Stock</p>
        <p class="text-3xl font-bold text-red-600">{{ outOfStock }}</p>
      </div>
    </div>

    <!-- Blood Type Cards -->
    <div class="grid grid-cols-8 gap-3 mb-6">
      <div
        v-for="item in inventory"
        :key="item.id"
        class="bg-white rounded-xl border p-3 text-center"
      >
        <p class="text-xs text-gray-500">{{ item.bloodType }}{{ item.rhFactor }}</p>
        <p
          class="text-2xl font-bold"
          :class="item.unitsAvailable < item.minimumStock ? 'text-red-600' : 'text-green-600'"
        >
          {{ item.unitsAvailable }}
        </p>
        <p class="text-xs text-gray-400">units</p>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-white rounded-xl border">
      <div class="p-4 border-b">
        <h2 class="font-medium text-sm">Inventory Details</h2>
      </div>
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Blood Type</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Units Available</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Minimum Stock</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Status</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Last Updated</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="item in inventory" :key="item.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">{{ item.bloodType }}{{ item.rhFactor }}</td>
            <td class="px-4 py-3">
              <input
                v-if="editingId === item.id"
                v-model.number="editForm.unitsAvailable"
                type="number"
                class="w-20 px-2 py-1 border rounded text-sm"
              />
              <span v-else>{{ item.unitsAvailable }}</span>
            </td>
            <td class="px-4 py-3">
              <input
                v-if="editingId === item.id"
                v-model.number="editForm.minimumStock"
                type="number"
                class="w-20 px-2 py-1 border rounded text-sm"
              />
              <span v-else>{{ item.minimumStock }}</span>
            </td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-0.5 rounded text-xs font-medium"
                :class="item.unitsAvailable < item.minimumStock
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'"
              >
                {{ item.unitsAvailable < item.minimumStock ? 'Low Stock' : 'In Stock' }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ formatDate(item.lastUpdated) }}</td>
            <td class="px-4 py-3">
              <div v-if="editingId === item.id" class="flex gap-2">
                <button @click="saveEdit(item.id)" class="text-xs bg-green-50 text-green-700 px-3 py-1 rounded border border-green-200 hover:bg-green-100">Save</button>
                <button @click="editingId = null" class="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded border hover:bg-gray-100">Cancel</button>
              </div>
              <button v-else @click="startEdit(item)" class="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded border hover:bg-gray-100">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
