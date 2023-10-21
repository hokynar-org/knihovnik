<script lang="ts">
  import CommunityUsers from '$lib/components/Community/CommunityUsers.svelte';
  export let data;
  $: community_users = data.community_users;
</script>

<CommunityUsers {community_users} cls="mt-6" />
