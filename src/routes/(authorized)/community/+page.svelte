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

  <div>
    <ol class="breadcrumb">
      <li class:text-4xl={isSearch} class:text-2xl={!isSearch}>
        {#if isSearch}
          Search for a public community
        {:else}
          <a href={'/community/search'}>Search for a public community</a>
        {/if}
      </li>
      <li class="crumb-separator text-3xl" aria-hidden>/</li>

      <li class:text-4xl={!isSearch} class:text-2xl={isSearch}>
        {#if !isSearch}
          Create new community
        {:else}
          <a href={'/community/new'}>Create new community</a>
        {/if}
      </li>
    </ol>
  </div>
  {#if isSearch}
    <Search data={$page.data} />
  {:else}
    <New data={$page.data} />
  {/if}
</div>
