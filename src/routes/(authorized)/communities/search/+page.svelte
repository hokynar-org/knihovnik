<script lang="ts">
  import CommunityCard from '$lib/components/Community/CommunityCard.svelte';
  import ItemPageBar from '$lib/components/ItemDisplay/ItemPageBar.svelte';
  import ItemPaginator from '$lib/components/ItemDisplay/ItemPaginator.svelte';

  export let data;
  let communities = data.communities;
  let offset = data.offset;
  let limit = data.limit;
  let length = data.length;
  let search = data.search;

  $: communities = data.communities;
  $: offset = data.offset;
  $: limit = data.limit;
  $: length = data.length;
  $: search = data.search;
</script>

<h2 class="text-4xl mb-4">Public communities</h2>
<ItemPageBar {limit} {offset} {length} {search} root="/communities/search" />
<div
  class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 mt-6"
>
  {#each communities as community}
    <CommunityCard {community} />
  {/each}
</div>
<ItemPaginator
  {limit}
  {offset}
  {length}
  {search}
  root="/communities/search"
  cls="mt-6"
/>
