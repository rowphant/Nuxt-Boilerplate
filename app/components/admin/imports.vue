<template>
  <div>Imports</div>
  <UForm
    :state="{ loading: false }"
    @submit="fetchUsers"
    class="max-w-4xl mx-auto space-y-8 rounded-lg"
    :ui="{ form: 'space-y-8' }"
  >
    <h1 class="text-4xl">Fetch Users</h1>
    <div class="space-x-2">
      <UButton @click="initUserImport" class="cursor-pointer">
        Fetch users company data and import as group
      </UButton>
      <!-- <UButton @click="setRelatedSystemsToCompany" class="cursor-pointer">
        Add related product series to companies
      </UButton> -->
    </div>
    <!-- Results -->
    <div v-if="showResults" class="p-8 rounded-lg bg-slate-950">
      <div class="space-y-4 sticky_ py-2 top-14 bg-slate-950">
        <div class="text-lg font-semibold mb-2">Fetched Users</div>
        <div class="flex flex-wrap gap-2 items-center">
          <div>Total users:</div>
          <div v-if="users.length">
            {{ users.length }}
          </div>
          <UButton v-else loading variant="ghost"></UButton>
        </div>
      </div>
      <div class="space-y-4">
        <div class="text-lg font-semibold mb-2">Processing</div>
        <ul v-if="processed" class="flex flex-col gap-2">
          <li v-for="(process, key, index) in processed" :key="index">
            <UBadge
              class="flex flex-col p-2"
              variant="subtle"
              color="neutral"
              size="lg"
            >
              <div class="w-full flex flex-row gap-4">
                <div class="min-w-24">
                  <div
                    class="w-full rounded-lg border-muted border bg-black/20 p-2 min-h-10 min-w-10 w-fit flex flex-col items-center justify-center"
                  >
                    <div class="flex flex-row items-center gap-2">

                        <span class="text-4xl  font-light text-primary">{{ index+1 }}</span>/<span>{{ users.length }}</span>
                    </div>
                    <span class="text-xs font-normal text-muted">ID {{ key }}</span>
                  </div>
                </div>
                <div>
                  <UButton
                    v-if="typeof process === null"
                    variant="ghost"
                    loading
                  />
                  <ul v-if="process?.messages?.length">
                    <li
                      v-for="(message, messageIndex) in process.messages"
                      :key="messageIndex"
                    >
                      <div
                        class="flex flex-col gap-1"
                        :class="{
                          'text-success': message.type === 'success',
                          'text-info_': message.type === 'info',
                          'text-warning': message.type === 'warning',
                          'text-error': message.type === 'error',
                        }"
                      >
                        <span>{{ message.message }}</span>
                        <!-- <ul
                          v-if="message.items?.length"
                          class="flex flex-row gap-1 flex-wrap"
                        >
                          <li
                            v-for="(item, itemIndex) in message.items"
                            :key="itemIndex"
                          >
                            <UBadge color="neutral" variant="subtle">{{ item.id }}</UBadge>
                          </li>
                        </ul> -->
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </UBadge>
          </li>
        </ul>
      </div>
    </div>
  </UForm>
</template>
<script setup lang="ts">
import { ref } from "vue";

// const username = "info@robertmetzner.com";
// const password = "hxt3y*Jqq5QEWnKQS1e4xt#9";
// const authString = 'Basic ' + btoa(`${username}:${password}`);
const authString =
  "Bearer " +
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgxODEiLCJpYXQiOjE3NDk3NTA5NjYsIm5iZiI6MTc0OTc1MDk2NiwiZXhwIjoxNzUwMzU1NzY2LCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.xleiWWam3Il8G2HJRhr-VMwAqBEySlo5gte2yVMYGxM";

const showResults = ref(false);
const users = ref([]);
const processed = ref({});

const fetchUsers = async () => {
  const username = "Robert Metzner";
  const password = "hxt3y*Jqq5QEWnKQS1e4xt#9x";
  const authString = btoa(`${username}:${password}`);

  fetch("http://localhost:8181/wp-json/wp/v2/users", {
    headers: {
      Authorization: `Basic ${authString}`,
    },
  })
    .then((response) => {
      // Die Gesamtzahl der Posts aus dem Header lesen
      const totalPosts = response.headers.get("X-WP-Total");
      console.log("Users total:", totalPosts);

      return response.json();
    })
    .then((posts) => {
      //   console.log("fetched users:", posts);
      // Hier kannst du mit den abgerufenen Posts arbeiten
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
};

const fetchAllPostIds = async ({
  postType,
  authorId,
  fields = ["id"],
  returnIdArray = true,
}) => {
  let allPostIds = [];
  let page = 1;
  let totalPages = 1; // Wird beim ersten Aufruf aktualisiert
  const perPage = 100; // Hole das Maximum an Benutzern pro Anfrage

  try {
    while (page <= totalPages) {
      const response = await fetch(
        `http://localhost:8181/wp-json/wp/v2/${postType}?status=any&per_page=${perPage}&page=${page}${
          authorId ? `&author=${authorId}` : ""
        }${fields.map((field) => `&_fields[]=${field}`).join("")}`,
        {
          headers: {
            Authorization: `${authString}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Den X-WP-TotalPages Header lesen, um die Gesamtzahl der Seiten zu erhalten
      // Dies sollte beim ersten Request zuverlässig sein und sich danach nicht ändern
      if (page === 1) {
        const totalPosts = response.headers.get("X-WP-Total");
        totalPages = parseInt(response.headers.get("X-WP-TotalPages"));
      }

      const posts = await response.json();

      // Extrahiere die IDs und füge sie dem Array hinzu
      if (returnIdArray) {
        const currentPageIds = posts.map((post) => post.id);
        allPostIds = allPostIds.concat(currentPageIds);

        allPostIds.sort(function (a, b) {
          return a - b;
        });
      } else {
        const currentPageIds = posts;
        allPostIds = allPostIds.concat(currentPageIds);

        allPostIds.sort(function (a, b) {
          return a.id - b.id;
        });
      }

      page++; // Gehe zur nächsten Seite
    }

    // console.log("Liste aller User IDs: ", allPostIds);
    // console.log("Anzahl der abgerufenen User IDs: ", allPostIds.length);

    return allPostIds;
  } catch (error) {
    console.error("Fehler beim Abrufen der User IDs: ", error);
    return []; // Gib ein leeres Array im Fehlerfall zurück
  }
};

const fetchCompanyData = async (userId: number) => {
  return await $fetch(
    "http://localhost:8181/wp-json/wp/v2/users/" + userId + "?_fields[]=acf",
    {
      headers: {
        Authorization: `${authString}`,
      },
    }
  );
};

const setUserGroup = async (
  groupId: number | null,
  userId: number,
  acf: Object = {}
) => {
  //   if (groupId) {
  //     console.log("Update group: ", groupId);
  //   } else if (!acf?.company_name) {
  //     console.warn(
  //       "No company name provided, skipping group creation for user ID:",
  //       userId
  //     );
  //     return null;
  //   }

  if (groupId) {
    console.log("Update group: ", groupId);
  } else {
    console.log("Create new group...");
    if (!acf?.company_name) {
      console.warn(
        "No company name provided, skipping group creation for user ID:",
        userId
      );
      return null;
    }
  }

  const path = groupId ? `user-groups/${groupId}` : "user-groups";
  const createGroup = await $fetch(
    `http://localhost:8181/wp-json/wp/v2/${path}?_fields[]=id`,
    {
      method: "POST",
      headers: {
        Authorization: `${authString}`,
      },
      body: {
        title: acf?.company_name,
        featured_media: acf?.company_logo || null,
        author: userId,
        status: "publish",
        acf: {
          related_storage_systems: acf?.related_storage_systems.map(
            (system) => system.id
          ),
          company_name: acf?.company_name || null,
          company_type: acf.company_type || null,
          company_website: acf?.company_website || null,
          company_logo: acf.company_logo || null,
          ustid: acf?.ustid || null,
          first_name: acf?.first_name || null,
          last_name: acf?.last_name || null,
          email: acf?.email || null,
          phone: acf?.phone || acf?.Telefon || null,
        },
      },
    }
  );

  return createGroup;
};

const checkIfgroupsExist = async (userId: number) => {
  let allPostIds = [];

  try {
    const response = await $fetch(
      `http://localhost:8181/wp-json/wp/v2/user-groups?author=${userId}&_fields[]=id`,
      {
        headers: {
          Authorization: `${authString}`,
        },
      }
    );

    const currentPostIds = response.map((post) => post.id);
    allPostIds = allPostIds.concat(currentPostIds);

    allPostIds.sort(function (a, b) {
      return a - b;
    });

    return allPostIds.length > 0 ? allPostIds : null;
  } catch (error) {
    console.error("Error checking if group exists:", error);
    return false;
  }
};

const updateStorageSystem = async (storageSystem) => {
  if (!storageSystem?.acf?.product_image) {
    console.warn(
      `No product image found for storage system ID ${storageSystem.id}. Skipping update.`
    );
    console.log("Storage System:", storageSystem);
    return null;
  }

  const fetchStorageSystem = await $fetch(
    `http://localhost:8181/wp-json/wp/v2/storage_systems/${storageSystem.id}?_fields[]=id&_fields[]=featured_media`,
    {
      method: "POST",
      headers: {
        Authorization: `${authString}`,
      },
      body: {
        featured_media: storageSystem?.acf?.product_image || null,
      },
    }
  );

  return fetchStorageSystem;
};

const initUserImport = async () => {
  showResults.value = true;
  console.log("initUserImport");
  const fetchedUserIds = await fetchAllPostIds({
    postType: "users",
    fields: ["id", "acf"],
    returnIdArray: false,
  });

  users.value = fetchedUserIds;
  //   const fetchedUserIds = [100, 89];

  for (let i = 0; i < fetchedUserIds.length; i++) {
    //   for (let i = 0; i < 5; i++) {
    const user = fetchedUserIds[i];
    console.log(`🟢 ${i + 1}/${fetchedUserIds.length}`);
    console.log("User ID:", user.id);
    processed.value[user.id] = {
      messages: [],
      storageSystems: [],
    };

    console.log("processed.value", processed.value);

    if (!user.acf.company_name) {
      processed.value[user.id].messages.push({
        type: "error",
        message: `No company name found.`,
      });
      console.warn(
        `No company name found for user ID ${user.id}. Skipping user.`
      );
      continue;
    }

    const userId = user.id;
    const existingGroups = await checkIfgroupsExist(userId);

    if (existingGroups) {
      // Fetch storage systems for the user
      const storageSystemsIds = await fetchAllPostIds({
        postType: "storage_systems",
        authorId: userId,
        fields: ["id", "featured_media", "acf"],
        returnIdArray: false,
      });

      if (!storageSystemsIds || storageSystemsIds.length === 0) {
        console.warn(`No storage systems found for user ID `, userId);
        processed.value[user.id].messages.push({
          type: "warning",
          message: `No storage systems found.`,
        });
        continue;
      } else {
        console.log(`Storage systems:`, storageSystemsIds);
        processed.value[user.id].storageSystems = storageSystemsIds;

        processed.value[user.id].messages.push({
          type: "info",
          message: `Storage systems found: ${storageSystemsIds.length}`,
          items: storageSystemsIds,
        });

        for (const storageSystem of storageSystemsIds) {
          if (!storageSystem.acf.product_image) {
            console.warn(
              `No product image found for storage system ID ${storageSystem.id}. Skipping update.`
            );
            processed.value[user.id].messages.push({
              type: "warning",
              message: `No product image found for storage system ID ${storageSystem.id}.`,
            });
            continue;
          }

          if (storageSystem.featured_media) {
            console.warn(
              `Storage system with ID ${storageSystem.id} already has a featured media. Skipping update.`
            );
            processed.value[user.id].messages.push({
              type: "warning",
              message: `Storage system with ID ${storageSystem.id} already has a featured media. Skipping update.`,
            });
            continue;
          }

          console.log(
            `Updating storage system with ID ${storageSystem.id} for user ID ${userId}`
          );
          const updatedStorageSystem = await updateStorageSystem(storageSystem);
          console.log("Updated Storage System:", updatedStorageSystem);

          processed.value[user.id].messages.push({
            type: "success",
            message: `Storage system with ID ${storageSystem.id} updated successfully.`,
          });
        }

        // Update existing groups
        console.log(`User groups:`, existingGroups);
        for (const groupId of existingGroups) {
          const createdGroup = await setUserGroup(groupId, userId, {
            related_storage_systems: storageSystemsIds,
          });
        }
      }
    } else {
      // Create group
      const companyData = await fetchCompanyData(userId);
      console.log("companyData", companyData);

      const storageSystemsIds = await fetchAllPostIds({
        postType: "storage_systems",
        authorId: userId,
        fields: ["id", "featured_media", "acf"],
        returnIdArray: false,
      });

      if (!storageSystemsIds || storageSystemsIds.length === 0) {
        console.warn(`No storage systems found for user ID ${userId}.`);
        processed.value[user.id].messages.push({
          type: "warning",
          message: `No storage systems found for user ID ${userId}.`,
        });
      } else {
        console.log(
          `storageSystemsIds with author ID ${userId}: `,
          storageSystemsIds
        );

        processed.value[user.id].messages.push({
          type: "info",
          message: `Storage systems found: ${storageSystemsIds.length}`,
          items: storageSystemsIds,
        });

        for (const storageSystem of storageSystemsIds) {
          if (!storageSystem.acf.product_image) {
            console.warn(
              `No product image found for storage system ID ${storageSystem.id}. Skipping update.`
            );
            processed.value[user.id].messages.push({
              type: "warning",
              message: `No product image found for storage system ID ${storageSystem.id}.`,
            });
            continue;
          }

          if (storageSystem.featured_media) {
            console.warn(
              `Storage system with ID ${storageSystem.id} already has a featured media. Skipping update.`
            );
            processed.value[user.id].messages.push({
              type: "warning",
              message: `Storage system with ID ${storageSystem.id} already has a featured media. Skipping update.`,
            });
            continue;
          }

          console.log(
            `Updating storage system with ID ${storageSystem.id} for user ID ${userId}`
          );
          const updatedStorageSystem = await updateStorageSystem(storageSystem);
          console.log("Updated Storage System:", updatedStorageSystem);
          processed.value[user.id].messages.push({
            type: "success",
            message: `Storage system with ID ${storageSystem.id} updated successfully.`,
          });
        }
      }

      const createdGroup = await setUserGroup(null, userId, {
        ...companyData.acf,
        related_storage_systems:
          storageSystemsIds.length > 0 ? storageSystemsIds : null,
      });
      console.log("createdGroup", createdGroup);
      processed.value[user.id].messages.push({
        type: "success",
        message: `Group created successfully with ID ${createdGroup.id}.`,
      });
    }
  }
};

const setRelatedSystemsToCompany = async (userId: number) => {
  const fetchedGroupIds = await fetchAllPostIds({ postType: "user-groups" });
  console.log("Fetched Group IDs:", fetchedGroupIds);
};
</script>
