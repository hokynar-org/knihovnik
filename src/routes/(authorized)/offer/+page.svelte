<script lang="ts">
  import ItemCard from '$lib/components/ItemDisplay/ItemCard.svelte';
  import Fa from 'svelte-fa';
  import { faClock } from '@fortawesome/free-solid-svg-icons';
  import type { PageData } from './$types';
  import OfferItem from '$lib/components/ItemDisplay/Actions/OfferItem.svelte';
  import ItemSearch from '$lib/components/ItemDisplay/ItemSearch.svelte';
  import ItemGrid from '$lib/components/ItemDisplay/ItemGrid.svelte';
  import TransferType from '$lib/components/ItemDisplay/Status/TransferType.svelte';
  import ItemPageBar from '$lib/components/ItemDisplay/ItemPageBar.svelte';
  import ItemPaginator from '$lib/components/ItemDisplay/ItemPaginator.svelte';
  export let data: PageData;
  $: user = data.user;
  let offers = data.user_items;
  let offset = data.offset;
  let limit = data.limit;
  let length = data.length;
  let search = data.search;

  $: offers = data.user_items;
  $: offset = data.offset;
  $: limit = data.limit;
  $: length = data.length;
  $: search = data.search;

  let searchTerm: string;
</script>

<ItemPageBar {limit} {offset} {length} {search} root="/offer" />

<ItemGrid cls="mt-6">
  {#each offers as offer (offer.item.id)}
    <ItemCard item={offer.item}>
      <TransferType item={offer.item} />
      {#if offer.holder && user.id == offer.holder.id}
        <div class="flex flex-wrap items-center text-lg">
          <div class="mx-auto">
            <a href={'/item/' + offer.item.id + '/edit'}>Edit</a>
          </div>
          <div class="mx-auto">
            <OfferItem item={offer.item} />
          </div>
        </div>
      {:else}
        <div class="flex items-center text-lg">
          <p><Fa icon={faClock} /></p>
          <p class="pl-2 py-[.625rem]">You have lent this item</p>
        </div>
      {/if}
    </ItemCard>
  {/each}
</ItemGrid>

{#if offers.length > 0}<ItemPaginator
    {offset}
    {limit}
    {search}
    {length}
    root="/offer"
    cls="mt-6"
  />{/if}
