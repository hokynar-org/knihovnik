<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;

  $: user_communities = data.user_communities;
</script>

<div>
  <div class="w-xs">
    <h2 class="text-2xl mb-4">Your communities</h2>

    {#each user_communities as community (community.communities.id)}
      <a href={'/community/' + community.communities.id}
        >{community.communities.name} ({community.user_community_relations
          .role})</a
      ><br />
    {/each}
  </div>

  <div>
    <a href="/community/new"
      ><h2 class="text-2xl mt-6 mb-2">Create new community</h2></a
    >
  </div>

  <div>
    <a href="/community/search"
      ><h2 class="text-2xl mt-6 mb-2">Search for a public community</h2></a
    >
  </div>
</div>
