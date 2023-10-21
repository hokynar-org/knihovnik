<script lang="ts">
  import ItemGrid from '$lib/components/ItemDisplay/ItemGrid.svelte';
  import ItemCard from '$lib/components/ItemDisplay/ItemCard.svelte';
  import ItemPageBar from '$lib/components/ItemDisplay/ItemPageBar.svelte';
  import ItemPaginator from '$lib/components/ItemDisplay/ItemPaginator.svelte';
  export let data;

  let community_items = data.community_items;
  let offset = data.offset;
  let limit = data.limit;
  let length = data.length;
  let search = data.search;

  $: community_items = data.community_items;
  $: offset = data.offset;
  $: limit = data.limit;
  $: length = data.length;
  $: search = data.search;

  $: community = data.community;
  $: community_items = data.community_items;
</script>

<h3 class="mt-10 mb-2 text-2xl">Community Items</h3>
<ItemPageBar
  {limit}
  {offset}
  {length}
  {search}
  root="/community/{community.id}/items"
/>
<ItemGrid cls="mt-6 ">
  {#each community_items as offer (offer.item.id)}
    <ItemCard item={offer.item}></ItemCard>
  {/each}
</ItemGrid>
<ItemPaginator
  {offset}
  {limit}
  {search}
  {length}
  root="/community/{community.id}/items"
  cls="mt-6"
/>
