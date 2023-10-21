<script lang="ts">
  import type { CommunityUserSafe } from '$lib/types';
  export let community_users: CommunityUserSafe[];
  export let cls = '' as string;
</script>

<div class={cls}>
  <h3 class="mb-2 text-2xl">Users in this community</h3>
  {#each community_users as community_user}
    <a href={'/user/' + community_user.user.id}
      >{community_user.user.user_name}</a
    >
    ({community_user.relation.role})
    <br />
  {/each}
</div>
