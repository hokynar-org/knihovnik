<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
  import { page } from '$app/stores';
  import CommunityCard from '$lib/components/Community/CommunityCard.svelte';

  $: user_communities = data.user_communities;

  let isSearch = true;
</script>

<div>
  <div class="w-xs">
    <h2 class="text-4xl mb-4">Your communities</h2>
    <div
      class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2"
    >
      {#each user_communities as community}
        <CommunityCard
          community={community.communities}
          relation={community.user_community_relations}
        />
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
