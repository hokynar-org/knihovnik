<script lang="ts">
  import type { Community, User } from '$lib/types';
  export let data;
  $: community = data.community;
  $: community_users = data.community_users;
  $: role = data.role;
</script>

<h4>Community: {community.name}</h4>
<p>{community.description}</p>
<div>
  {#if role}
    You are a {role}
  {/if}
</div>
<div>
  {#each community_users as community_user}
    {community_user.user.user_name} ({community_user.relation.role})
  {/each}
</div>
