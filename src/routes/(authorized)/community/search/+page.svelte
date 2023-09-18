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
</script>

<div>
  <h2 class="text-2xl mt-6 mb-2">Search for a public community</h2>
  <div class="input-group input-group-divider flex">
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
          })
          .catch((reason) => {
            disabled = false;
          });
      }}
      disabled={search_name.length < 2 || disabled}
      type="button"
      class="btn btn-sm variant-filled"
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
  <h2 class="text-2xl mt-6 mb-4">Found public communities</h2>
  {#each found_communities as community (community.id)}
    <a href={'/community/' + community.id}>{community.name} </a><br />
  {/each}
</div>
