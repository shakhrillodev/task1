<script setup lang="ts">
import { computed, ref, markRaw, toRaw, onMounted, onUnmounted } from "vue";
import { Icons } from "@/components/icons";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-icons/vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { ComposeOption } from "echarts/core";
import type { BarSeriesOption } from "echarts/charts";
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
} from "echarts/components";

use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
]);

type EChartsOption = ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | BarSeriesOption
>;

interface AnalyticsData {
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  activeSessions: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
}

const analyticsData = ref<AnalyticsData>({
  totalUsers: 1,
  activeSessions: 2,
  revenueByMonth: [
    { month: "January", revenue: 12000 },
    { month: "February", revenue: 15000 },
    { month: "March", revenue: 18000 },
    { month: "April", revenue: 14000 },
    { month: "May", revenue: 20000 },
    { month: "June", revenue: 22000 },
    { month: "July", revenue: 17000 },
    { month: "August", revenue: 21000 },
    { month: "September", revenue: 19000 },
    { month: "October", revenue: 23000 },
    { month: "November", revenue: 25000 },
    { month: "December", revenue: 30000 },
  ],
  totalProducts: 3,
  totalRevenue: 1,
});

const loading = ref(true);

const calcDiffPercent = (prev: number, curr: number) => {
  if (prev === 0) {
    return curr === 0 ? 0 : 100;
  }
  return Math.floor(((curr - prev) / prev) * 100);
};

let prevData = { ...analyticsData.value };

interface CardData {
  label: string;
  icon: any;
  data: number;
  diff: number;
}

const cards = computed<CardData[]>(() => {
  const data = [
    {
      label: "Total Users",
      icon: markRaw(Icons.PeopleIcon),
      data: analyticsData.value.totalUsers,
      diff: calcDiffPercent(
        prevData.totalUsers,
        analyticsData.value.totalProducts
      ),
    },
    {
      label: "Total Products",
      icon: markRaw(Icons.BoxIcon),
      data: analyticsData.value.totalProducts,
      diff: calcDiffPercent(
        prevData.totalProducts,
        analyticsData.value.totalProducts
      ),
    },
    {
      label: "Total Revenue",
      icon: markRaw(Icons.DollarIcon),
      data: analyticsData.value.totalRevenue,
      diff: calcDiffPercent(
        prevData.totalRevenue,
        analyticsData.value.totalProducts
      ),
    },
    {
      label: "Active Sessions",
      icon: markRaw(Icons.SessionIcon),
      data: analyticsData.value.activeSessions,
      diff: calcDiffPercent(
        prevData.activeSessions,
        analyticsData.value.totalProducts
      ),
    },
  ];
  prevData = structuredClone(toRaw(analyticsData.value));
  return data;
});

const barChartData = computed<EChartsOption>(() => ({
  title: {
    text: "Revenue per month",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: "0%",
    right: "0%",
    bottom: "0%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      data: analyticsData.value.revenueByMonth.map((i) => i.month),
      axisTick: {
        alignWithLabel: true,
      },
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "Direct",
      type: "bar",
      barWidth: "60%",
      data: analyticsData.value.revenueByMonth.map((i) => i.revenue),
    },
  ],
}));

function generateRandomNumber(range: number) {
  return Math.floor(Math.random() * range);
}

function updateData() {
  console.log("Update");
  analyticsData.value = {
    totalUsers: generateRandomNumber(1000),
    activeSessions: generateRandomNumber(500),
    revenueByMonth: [
      { month: "January", revenue: generateRandomNumber(25000) },
      { month: "February", revenue: generateRandomNumber(25000) },
      { month: "March", revenue: generateRandomNumber(25000) },
      { month: "April", revenue: generateRandomNumber(25000) },
      { month: "May", revenue: generateRandomNumber(25000) },
      { month: "June", revenue: generateRandomNumber(25000) },
      { month: "July", revenue: generateRandomNumber(25000) },
      { month: "August", revenue: generateRandomNumber(25000) },
      { month: "September", revenue: generateRandomNumber(25000) },
      { month: "October", revenue: generateRandomNumber(25000) },
      { month: "November", revenue: generateRandomNumber(25000) },
      { month: "December", revenue: generateRandomNumber(25000) },
    ],
    totalProducts: generateRandomNumber(200),
    totalRevenue: generateRandomNumber(100000),
  };
}

let analyticUpdateIntervalId: number;
let analyticUpdateTimeOutId: number;

onMounted(() => {
  analyticUpdateTimeOutId = setTimeout(() => {
    loading.value = false;
    analyticUpdateIntervalId = setInterval(() => {
      updateData();
    }, 5000);
  }, 1000);
});

onUnmounted(() => {
  clearTimeout(analyticUpdateTimeOutId);
  clearInterval(analyticUpdateIntervalId);
});
</script>
<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-500">View analytics</p>
    </div>
    <div class="flex gap-4 flex-wrap">
      <div
        v-for="card in cards"
        :key="card.label"
        class="bg-blue-50 hover:bg-blue-100/10 transition-all cursor-pointer px-2 py-3 rounded-lg border border-blue-200 flex-grow basis-[250px]"
      >
        <template v-if="loading">
          <div class="flex justify-between items-center">
            <div class="flex gap-2 items-center text-blue-800 text-xl">
              <div
                class="w-[120px] h-[20px] animate-pulse bg-gray-400 rounded"
              ></div>
            </div>
            <div
              class="w-[20px] h-[20px] animate-pulse bg-gray-400 rounded"
            ></div>
          </div>
          <div
            class="w-[20px] h-[20px] animate-pulse bg-gray-400 rounded mt-7"
          ></div>
        </template>
        <template v-else>
          <div class="flex justify-between items-center">
            <div class="flex gap-2 items-center text-blue-800 text-xl">
              <span class="text-nowrap">{{ card.label }}</span>
              <component :is="card.icon" width="30px" height="30px" />
            </div>
            <div
              class="flex gap-1 items-center text-green-400"
              :class="[card.diff <= 0 && '!text-red-500']"
            >
              <span>{{ card.diff }}%</span>
              <ArrowUpIcon v-if="card.diff > 0" />
              <ArrowDownIcon v-else />
            </div>
          </div>
          <p
            class="mt-2 font-bold text-2xl text-green-600"
            :class="[card.diff < 1 && '!text-red-500']"
          >
            {{ card.data }}
          </p>
        </template>
      </div>
    </div>
    <v-chart
      :loading="loading"
      class="h-[400px]"
      :option="barChartData"
      autoresize
    />
  </div>
</template>
