<script setup lang="ts">
const routes = [
  {
    path: "/",
    label: "Dashboard",
  },
  {
    path: "/user-management",
    label: "User management",
  },
  {
    path: "/product-management",
    label: "Product management",
  },
];


</script>

<template>
  <div class="min-h-screen bg-gray-50 flex gap-2">
    <div class="shrink-0 basis-[300px] flex-col hidden md:flex">
      <router-link 
        class="w-full p-2 bg-gray-400 text-white font-semibold"
      v-for="route in routes"
       :key="route.path"
       :to="route.path"
       >
        {{ route.label }}
      </router-link>
    </div>
    <div class="flex-1 container mx-auto p-6">
      <router-view />
    </div>
  </div>
</template>
