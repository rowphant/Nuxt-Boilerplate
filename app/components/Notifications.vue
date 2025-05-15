<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted, watch } from "vue";

const { user } = useUser();
// const props = defineProps<{
//   color: ToastProps["color"];
//   defaultOpen: ToastProps["defaultOpen"];
//   description: ToastProps["description"];
//   duration: ToastProps["duration"];
//   open: ToastProps["open"];
//   title: ToastProps["title"];
// }>();

const sendVerificationEmail = async () => {
  const { user } = useUser();
  const { $apiFetch } = useNuxtApp();

  if (!user.value?.id) {
    console.error("User ID is not defined");
    return;
  }

  try {
    const response = await $apiFetch(`/wp-json/wp/v2/send-verification-email`, {
      method: "POST",
      body: JSON.stringify({
        id: user.value.id,
      }),
    });

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
  } catch (e) {
    if (!e.data) {
      console.error("No error data received");
      return e;
    }
  }
};

const showToast = async () => {
  const { user } = useUser();
  console.log("showToast");
  if (user.value?.id && user.value?.account_activated === false) {
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
  () => user?.value?.id,
  (newValue) => {
    showToast();
  }
);
</script>
