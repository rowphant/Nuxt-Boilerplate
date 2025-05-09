<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useAuthStore } from "~/stores/auth";
// import type { ToastProps } from "@nuxt/ui";

// const props = defineProps<{
//   color: ToastProps["color"];
//   defaultOpen: ToastProps["defaultOpen"];
//   description: ToastProps["description"];
//   duration: ToastProps["duration"];
//   open: ToastProps["open"];
//   title: ToastProps["title"];
// }>();

const sendVerificationEmail = async () => {
  const { $config } = useNuxtApp();
  const apiBase = $config.public?.apiBase;
  const userId = useAuthStore()?.user?.id;

  if (!apiBase) {
    console.error("API base is not defined");
    return;
  }

  if (!userId) {
    console.error("User ID is not defined");
    return;
  }

  try {
    const response = await $fetch(
      `${apiBase}/wp-json/wp/v2/send-verification-email`,
      {
        method: "POST",
        body: JSON.stringify({
          id: userId,
        }),
      }
    );

    if (response?.code === 200) {
      const toast = useToast();

      toast.add({
        title: "An activation link has been sent to your email.",
        color: "success",
      });
    }

    if (!response) {
      console.error("No response received");
      return;
    }
  } catch (error) {
    if (!error.data) {
      console.error("No error data received");
      return;
    }
  }
};

const showToast = async () => {
  if (
    useAuthStore()?.user?.id &&
    useAuthStore()?.user?.account_activated !== true
  ) {
    const toast = useToast();

    toast.add({
      title: "Your account is not activated yet.",
      description: "Activate your account by clicking the link in your email.",
      color: "warning",
      duration: 60000,
      actions: [
        {
          icon: "i-lucide-refresh-cw",
          label: "Resend activation link",
          color: "neutral",
          variant: "outline",
          onClick: () => {
            sendVerificationEmail();
          },
        },
      ],
    });
  }
};

watch(
  () => useAuthStore()?.user?.id,
  (newValue) => {
    showToast();
  }
);
</script>
