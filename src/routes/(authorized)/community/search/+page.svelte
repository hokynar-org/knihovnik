<script lang="ts">
  import type { PageData } from './$types';
  import {
    faMagnifyingGlass,
    faSpinner,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import type { Community } from '$lib/types';
  let found_communities: Community[] = [];
  let search_name: string = '';
  const search = async () => {
    const res = await fetch(
      '/api/community/search?search_name=' + encodeURI(search_name),
    );
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as Community[];
  };
  let disabled = false;
  let searchedOnce = false;
</script>

<div>
  <div>
    <h2 class="text-2xl mt-6">Search for a public community</h2>
    <p class="text-base mt-1 min-w-xs max-w-xs">
      Only public communities can be found via this search. Enter at least 3
      characters.
    </p>
    <div class="input-group input-group-divider flex mt-4 min-w-xs max-w-xs">
      <input
        type="search"
        class="input w-full"
        placeholder="Search..."
        bind:value={search_name}
      />
      <button
        on:click={() => {
          disabled = true;
          search()
            .then((value) => {
              disabled = false;
              found_communities = value;
              searchedOnce = true;
            })
            .catch((reason) => {
              disabled = false;
              searchedOnce = true;
            });
        }}
        disabled={search_name.length < 2 || disabled}
        class="variant-filled-primary w-fit"
      >
        {#if !disabled}
          <Fa icon={faMagnifyingGlass} />
        {:else}
          <Fa icon={faSpinner} />
        {/if}
      </button>
    </div>
  </div>

  <div class="w-xs">
    <h2 class="text-2xl mt-8 mb-4">Found public communities</h2>
    {#each found_communities as community (community.id)}
      <a href={'/community/' + community.id}>{community.name} </a><br />
    {/each}
    {#if found_communities.length == 0 && searchedOnce}
      <p>No communities found</p>
    {/if}
  </div>
</div>
