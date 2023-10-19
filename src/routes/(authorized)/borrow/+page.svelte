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
  let searchTerm: string;
</script>

<div>
  <h2 class="text-4xl mx-4">Items on offer</h2>
</div>

<ItemSearch cls="mt-6 " bind:searchTerm bind:offersFiltered />
<div class="flex">
  <a
    class="btn variant-filled-primary"
    href="./borrow/?offset={Math.max(offset - 4, 0)}"
  >
    <Fa icon={faArrowLeft} />
  </a>
  <a class="btn variant-filled-primary" href="./borrow/?offset={offset + 4}">
    <Fa icon={faArrowRight} />
  </a>
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
