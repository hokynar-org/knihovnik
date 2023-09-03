<script lang="ts">
  import type { Community, User } from '$lib/types';
  export let data;
  $: community = data.community;
</script>

<h1>Community: {community.name}</h1>
<p>{community.description}</p>
