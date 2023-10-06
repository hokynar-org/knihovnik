<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
  import { page } from '$app/stores';
  import New from './new/+page.svelte';
  import Search from './search/+page.svelte';

  $: user_communities = data.user_communities;

  let isSearch = true;
</script>

<div>
  <div class="w-xs">
    <h2 class="text-4xl mb-4">Your communities</h2>

    {#each user_communities as community (community.communities.id)}
      <a href={'/community/' + community.communities.id}
        >{community.communities.name} ({community.user_community_relations
          .role})</a
      ><br />
    {/each}
    {#if user_communities.length == 0}
      <p>
        You aren't in any community just yet. Try searching for one or create a
        new one from scratch.
      </p>
    {/if}
  </div>

  <Search data={$page.data} />

  <h2 class="mt-12 text-4xl">
    <a href={'/community/new'}>New community</a>
  </h2>
</div>
