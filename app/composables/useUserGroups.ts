export const useUserGroups = () => {
  const createUserGroup = async (group) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch("/wp-json/wp/v2/user-groups?_fields[]=id", {
        method: "POST",
        body: { ...group, id: null },
      });

      return data;
    } catch (e) {
      console.error("Fehler beim Laden von Wordpress", e);
      return e;
    }
  };

  const editUserGroup = async (group) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch(
        "/wp-json/wp/v2/user-groups/" + group.id + "?_fields[]=id",
        {
          method: "POST",
          body: group,
        }
      );

      return data;
    } catch (e) {
      console.error("Fehler beim Laden von Wordpress", e);
      return e;
    }
  };

  const deleteUserGroup = async (group) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch("/wp-json/wp/v2/user-groups/" + group.id, {
        method: "DELETE",
      });

      return data;
    } catch (e) {
      console.error("Fehler beim Laden von Wordpress", e);
      return e;
    }
  };

  const searchGroups = async (search) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch(
        "/wp-json/wp/v2/user-groups?search=" + search,
        {
          method: "GET",
        }
      );

      return data;
    } catch (e) {
      console.error("Fehler beim Laden von Wordpress", e);
      return e;
    }
  };

  /**
   * Requests
   */
  const addGroupRequest = async (groupId) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch("/wp-json/hwp/v1/group-requests/send", {
        method: "POST",
        body: {
          group_id: groupId,
        },
      });

      return data;
    } catch (e) {
      return e;
    }
  };

  const deleteGroupRequest = async (groupId: number, userId: number) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch("/wp-json/hwp/v1/group-requests/delete", {
        method: "POST",
        body: {
          group_id: groupId,
          user_id: userId,
        },
      });

      return data;
    } catch (e) {
      return e;
    }
  };

  const groupRequestAction = async (
    groupId: number,
    userId: number,
    action: "accept" | "decline"
  ) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch("/wp-json/hwp/v1/group-requests/action", {
        method: "POST",
        body: {
          group_id: groupId,
          user_id: userId,
          action: action,
        },
      });

      return data;
    } catch (e) {
      return e;
    }
  };

  /**
   * Invitations
   */
  const addGroupInvitation = async (groupId: number, email: string) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch("/wp-json/hwp/v1/group-invitations/send", {
        method: "POST",
        body: {
          group_id: groupId,
          email: email,
        },
      });

      return data;
    } catch (e) {
      return e.data;
    }
  };

  const deleteGroupInvitation = async (groupId: number, email: string) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch("/wp-json/hwp/v1/group-invitations/delete", {
        method: "POST",
        body: {
          group_id: groupId,
          identifier: email,
        },
      });

      return data;
    } catch (e) {
      return e;
    }
  };

  const invitationAction = async (
    groupId: number,
    userId: number,
    action: "accept" | "decline"
  ) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch("/wp-json/hwp/v1/group-invitations/", {
        method: "POST",
        body: {
          group_id: groupId,
          identifier: String(userId),
          action: action,
        },
      });

      return data;
    } catch (e) {
      return e;
    }
  };

  /**
   * Members
   */
  const removeGroupMember = async (groupId: number, userId: number) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch("/wp-json/hwp/v1/group-members/remove", {
        method: "POST",
        body: {
          group_id: groupId,
          user_id: userId,
        },
      });

      return data;
    } catch (e) {
      return e;
    }
  };

  /**
   * Admins
   */
  const addGroupAdmin = async (groupId: number, userId: number) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch("/wp-json/hwp/v1/group-admins/add", {
        method: "POST",
        body: {
          group_id: groupId,
          user_id: userId,
        },
      });

      return data;
    } catch (e) {
      return e;
    }
  };

  const removeGroupAdmin = async (groupId: number, userId: number) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch("/wp-json/hwp/v1/group-admins/remove", {
        method: "POST",
        body: {
          group_id: groupId,
          user_id: userId,
        },
      });

      return data;
    } catch (e) {
      return e;
    }
  };  

  return {
    // Groups
    createUserGroup,
    editUserGroup,
    deleteUserGroup,
    searchGroups,

    // Requests
    addGroupRequest,
    deleteGroupRequest,
    groupRequestAction,

    // Invitations
    addGroupInvitation,
    deleteGroupInvitation,
    invitationAction,

    // Members
    removeGroupMember,

    // Admins
    addGroupAdmin,
    removeGroupAdmin
  };
};
