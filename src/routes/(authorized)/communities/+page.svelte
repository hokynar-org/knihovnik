<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
  import { page } from '$app/stores';
  import CommunityCard from '$lib/components/Community/CommunityCard.svelte';

  $: user_communities = data.user_communities;

  let isSearch = true;
</script>

<h2 class="text-4xl mt-6 mb-4">Your communities</h2>

<div>
  <div class="w-xs">
    <div
      class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2"
    >
      {#each user_communities as community}
        <CommunityCard {community} />
      {/each}
    </div>
    {#if user_communities.length == 0}
      <p>
        You aren't in any community just yet. Try searching for one or create a
        new one from scratch.
      </p>
    {/if}
  </div>
</div>
