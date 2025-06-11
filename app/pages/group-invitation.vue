<template>
  <div v-if="loading" class="text-center space-y-4">
    <!-- <h1 class="font-light text-2xl">Invitation</h1> -->
    <LoadingIndicator />
  </div>
  <div v-else class="w-sm mx-auto space-y-8 bg-navbar rounded-lg p-8">
    <div v-if="!loading && fetchResponse">
      <div v-if="fetchResponse.success === true" class="space-y-8">
        <div>
          <h1 class="font-light text-2xl">
            Welcome to the group {{ fetchResponse.group_title }}<span class="text-6xl">🥳</span>
          </h1>
        </div>
        <div v-if="fetchResponse.user_id !== user.id">
            You are logged in as user <b>{{ fetchResponse.user_name }}</b> ({{ fetchResponse.email }}).
            To accept the invitation, please log in as the invited user.
        </div>
        <div v-else>
            <RouterLink to="/user/groups">
              <UButton class="cursor-pointer">Go to your groups</UButton>
            </RouterLink>
        </div>
      </div>
      <div v-else class="space-y-4">
        <div>
          <h1 class="font-light text-2xl">Oops!</h1>
          <p>Something went wrong.</p>
        </div>
        <UBadge color="warning" variant="subtle">
          <div>{{ fetchResponse.message }}</div>
        </UBadge>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserGroups } from "~/composables/useUserGroups";
import LoadingIndicator from "~/components/LoadingIndicator.vue";

const loading = ref(true);
const route = useRoute();
const query = route.query;
const { user } = useUser();

console.log("current user ID: ", user.value.id);
console.log("response user ID: ", query.uid);

console.log("query: ", Boolean(Number("1")));
const { invitationAction } = useUserGroups();
const fetchResponse = ref<{
  success: boolean;
  code: number;
  message: string;
  groud_title?: string;
  user_id?: number;
  user_name?: string;
  email?: string;
} | null>(null);

onMounted(async () => {
  if (query.gid && query.uid && query.a) {
    loading.value = true;
    console.log(
      "invitationAction: ",
      query.gid,
      query.uid,
      Boolean(Number(query.a))
    );
    const response = await invitationAction(
      Number(query.gid),
      query.uid,
      Boolean(Number(query.a)) ? "accept" : "decline"
    );
    console.log("response: ", response);
    fetchResponse.value = response.data || response;
    loading.value = false;
  } else {
    console.log("Invalid query parameters");
    fetchResponse.value = {
      success: false,
      code: 400,
      message: "Invalid query parameters",
    };
  }
});
</script>
