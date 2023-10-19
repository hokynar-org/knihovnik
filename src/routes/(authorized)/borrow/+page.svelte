<script lang="ts">
  import Fa from 'svelte-fa';
  import {
    faCheck,
    faUser,
    faArrowLeft,
    faArrowRight,
  } from '@fortawesome/free-solid-svg-icons';
  import Item from '$lib/components/ItemDisplay/Item.svelte';
  import type { PublicItemSafe, PublicUserSafe } from '$lib/types';
  import ItemGrid from '$lib/components/ItemDisplay/ItemGrid.svelte';
  import ItemCard from '$lib/components/ItemDisplay/ItemCard.svelte';
  import ItemSearch from '$lib/components/ItemDisplay/ItemSearch.svelte';
  import OwnedBy from '$lib/components/ItemDisplay/Status/OwnedBy.svelte';
  import TransferType from '$lib/components/ItemDisplay/Status/TransferType.svelte';
  import { page } from '$app/stores';
  $: user = $page.data.user as PublicUserSafe;

  export let data;
  $: offersFiltered = data.offers;
  $: offset = data.offset;
  $: limit = data.limit;
  $: length = data.length;

  let searchTerm: string;
</script>

<div>
  <h2 class="text-4xl mx-4">Items on offer</h2>
</div>

<div class="flex mt-6 items-center">
  <ItemSearch cls="" bind:searchTerm bind:offersFiltered />
  <div class="grid grid-cols-2">
    {#if offset - limit >= 0}
      <a
        class="btn-icon h-10 variant-filled-primary rounded-r-none"
        href="./borrow/?offset={Math.max(offset - limit, 0)}&limit={Math.max(
          limit,
          1,
        )}"
      >
        <Fa icon={faArrowLeft} />
      </a>
    {:else}
      <button
        disabled={true}
        class="btn-icon h-10 variant-filled-primary rounded-r-none"
      >
        <Fa icon={faArrowLeft} />
      </button>
    {/if}
    {#if offset + limit < length}
      <a
        class="btn-icon h-10 variant-filled-primary rounded-l-none"
        href="./borrow/?offset={offset + limit}&limit={Math.max(limit, 1)}"
      >
        <Fa icon={faArrowRight} />
      </a>
    {:else}
      <button
        disabled={true}
        class="btn-icon h-10 variant-filled-primary rounded-l-none"
      >
        <Fa icon={faArrowRight} />
      </button>
    {/if}
  </div>
</div>
<ItemGrid cls="mt-6">
  {#each offersFiltered as offer (offer.item.id)}
    <ItemCard item={offer.item}>
      <!-- {#if offer.user != data.user}
      <BorrowItem borrow_request={offer.borrow_request} item={offer.item} />
    {/if} -->
      <div class="pb-2 text-lg">
        <OwnedBy owner={offer.owner} />
        <TransferType item={offer.item} />

        {#if offer.item.offered && offer.owner && offer.owner.id != user.id}
          <div class="flex items-baseline">
            <p><Fa icon={faCheck} /></p>
            <p class="pl-2">You can borrow this item</p>
          </div>
        {:else if offer.item.offered && offer.owner && offer.owner.id == user.id}
          <div class="flex items-baseline">
            <p><Fa icon={faCheck} /></p>
            <p class="pl-2">Others can borrow your item</p>
          </div>
        {/if}
      </div>
    </ItemCard>
  {/each}
  {#if data.offers.length == 0}
    <p>There are no items you can borrow right now :/</p>
  {/if}
</ItemGrid>
