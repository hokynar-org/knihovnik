<script lang="ts">
  import ItemCard from '$lib/components/ItemDisplay/ItemCard.svelte';
  import Fa from 'svelte-fa';
  import { faClock } from '@fortawesome/free-solid-svg-icons';
  import { user_items } from '$lib/store';
  import DeleteItem from '$lib/components/ItemDisplay/Actions/DeleteItem.svelte';
  import type { PageData } from './$types';
  import OfferItem from '$lib/components/ItemDisplay/Actions/OfferItem.svelte';
  import ItemSearch from '$lib/components/ItemDisplay/ItemSearch.svelte';
  import ItemGrid from '$lib/components/ItemDisplay/ItemGrid.svelte';
  import type { UserOffer } from '$lib/types';
  export let data: PageData;
  $: user = data.user;

  $: $user_items = data.user_items;

  let offersFiltered: UserOffer[] = [];
  $: {
    //Assign data once they are ready
    if ($user_items.length > 0 && offersFiltered.length === 0) {
      offersFiltered = $user_items;
    }
  }

  let searchTerm: string;
</script>

<ItemSearch cls="mt-6 " bind:searchTerm bind:offersFiltered />

<ItemGrid cls="mt-6">
  {#each offersFiltered as offer (offer.item.id)}
    <ItemCard item={offer.item} owner={user} holder={offer.holder}>
      {#if offer.holder && user.id == offer.holder.id}
        <div class="flex flex-wrap items-baseline text-lg">
          <div class="mx-auto">
            <a href={'/item/' + offer.item.id + '/edit'}>Edit</a>
          </div>
          <div class="mx-auto">
            <OfferItem item={offer.item} />
          </div>
        </div>
      {:else}
        <div class="flex items-baseline text-lg">
          <p><Fa icon={faClock} /></p>
          <p class="pl-2 py-[.625rem]">You have lent this item</p>
        </div>
      {/if}
    </ItemCard>
  {/each}
</ItemGrid>
