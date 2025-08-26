<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { AlertDialogRoot } from "reka-ui";

import type { AlertDialogProps, AlertDialogEmits } from "reka-ui";

interface Props extends /* @vue-ignore */ AlertDialogProps {
  open?: boolean;
}

interface Emits extends /* @vue-ignore */ AlertDialogEmits {
  "update:open": [value: boolean];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const open = useVModel(props, "open", emit, {
  defaultValue: false,
  passive: (props.open === undefined) as false,
});
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <slot />
  </AlertDialogRoot>
</template>
