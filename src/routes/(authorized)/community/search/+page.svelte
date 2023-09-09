<script lang="ts">
  import type { PageData } from './$types';
  import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  export let data: PageData;
  import type { Community } from '$lib/types';
  // $: public_communities = data.public_communities;
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
        search()
          .then((value) => {
            found_communities = value;
          })
          .catch((reason) => {});
      }}
      disabled={search_name.length < 2}
      class="variant-filled-primary w-fit"
    >
      <Fa icon={faMagnifyingGlass} />
    </button>
  </div>
</div>

<div class="w-xs">
  <h2 class="text-2xl mt-6 mb-4">Found public communities</h2>
  {#each found_communities as community (community.id)}
    <a href={'/community/' + community.id}>{community.name} </a><br />
  {/each}
</div>
