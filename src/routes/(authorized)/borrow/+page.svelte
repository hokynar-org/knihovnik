<script lang="ts">
  import BorrowItem from '$lib/components/ItemDisplay/BorrowItem.svelte';
  import Fa from 'svelte-fa';
  import { faCheck, faUser } from '@fortawesome/free-solid-svg-icons';
  import Item from '$lib/components/ItemDisplay/Item.svelte';
  import type { PublicItemSafe, PublicUserSafe } from '$lib/types';
  import ItemGrid from '$lib/components/ItemDisplay/ItemGrid.svelte';
  import ItemCard from '$lib/components/ItemDisplay/ItemCard.svelte';
  import ItemSearch from '$lib/components/ItemDisplay/ItemSearch.svelte';
  import { page } from '$app/stores';
  $: user = $page.data.user as PublicUserSafe;

  export let data;
  let offersFiltered = data.offers;
  let searchTerm: string;

  //$: console.log(searchTerm);
</script>

<div>
  <h2 class="text-4xl mx-4">Items on offer</h2>
</div>

<ItemSearch cls="mt-6 " bind:searchTerm bind:offersFiltered />

<ItemGrid cls="mt-6">
  {#each offersFiltered as offer (offer.item.id)}
    <ItemCard item={offer.item} owner={offer.owner} holder={null}>
      <!-- {#if offer.user != data.user}
      <BorrowItem borrow_request={offer.borrow_request} item={offer.item} />
    {/if} -->
      <div class="pb-2 text-lg">
        <div class="flex items-baseline">
          <p><Fa icon={faUser} /></p>
          {#if offer.owner.id == user.id}
            <p class="pl-2">You own this item</p>
          {:else}
            <p class="pl-2">
              <a href={'/user/' + offer.owner.id}>{offer.owner.user_name}</a> owns
              this item
            </p>
          {/if}
        </div>

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
