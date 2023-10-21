<script lang="ts">
  import Fa from 'svelte-fa';
  import { faCheck } from '@fortawesome/free-solid-svg-icons';
  import type { PublicItemSafe, PublicUserSafe } from '$lib/types';
  import ItemGrid from '$lib/components/ItemDisplay/ItemGrid.svelte';
  import ItemCard from '$lib/components/ItemDisplay/ItemCard.svelte';
  import OwnedBy from '$lib/components/ItemDisplay/Status/OwnedBy.svelte';
  import TransferType from '$lib/components/ItemDisplay/Status/TransferType.svelte';
  import { page } from '$app/stores';
  import ItemPageBar from '$lib/components/ItemDisplay/ItemPageBar.svelte';
  import ItemPaginator from '$lib/components/ItemDisplay/ItemPaginator.svelte';
  $: user = $page.data.user as PublicUserSafe;

  export let data;

  let offers = data.offers;
  let offset = data.offset; //Start from item no. offset
  let limit = data.limit; //Maximum number of items displayed
  let length = data.length;
  let search = data.search;

  $: offers = data.offers;
  $: offset = data.offset;
  $: limit = data.limit;
  $: length = data.length;
  $: search = data.search;

  let searchTerm: string;
</script>

<div>
  <h2 class="text-4xl mx-4">Items on offer</h2>
</div>

<ItemPageBar {limit} {offset} {length} {search} root="/borrow" />
<ItemGrid cls="mt-6">
  {#each offers as offer (offer.item.id)}
    <ItemCard item={offer.item}>
      <!-- {#if offer.user != data.user}
      <BorrowItem borrow_request={offer.borrow_request} item={offer.item} />
    {/if} -->
      <div class="pb-2 text-lg">
        <OwnedBy owner={offer.owner} />
        <TransferType item={offer.item} />

        {#if offer.item.offered && offer.owner && offer.owner.id != user.id}
          <div class="flex items-center">
            <p><Fa icon={faCheck} /></p>
            <p class="pl-2">You can borrow this item</p>
          </div>
        {:else if offer.item.offered && offer.owner && offer.owner.id == user.id}
          <div class="flex items-center">
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
<ItemPaginator {offset} {limit} {search} {length} root="/borrow" cls="mt-6" />
