import {
  createRouter,
  createWebHistory,
} from "vue-router";

import ProductManagement from "./components/ProductManagement.vue";
import UserManagement from "./components/UserManagement.vue";
import AnalyticsDashboard from "./components/AnalyticsDashboard.vue";
const routes = [
  { path: "/product-management", component: ProductManagement },
  { path: "/user-management", component: UserManagement },
  { path: "/", component: AnalyticsDashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
