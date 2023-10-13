<script lang="ts">
  import ItemCard from '$lib/components/ItemDisplay/ItemCard.svelte';
  import Fa from 'svelte-fa';
  import { faClock } from '@fortawesome/free-solid-svg-icons';
  import { user_items } from '$lib/store';
  import DeleteItem from '$lib/components/ItemDisplay/DeleteItem.svelte';
  import type { PageData } from './$types';
  import OfferItem from '$lib/OfferItem.svelte';
  import ItemGrid from '$lib/components/ItemDisplay/ItemGrid.svelte';
  export let data: PageData;
  $: user = data.user;

  $: $user_items = data.user_items;
</script>

<ItemGrid cls="mt-6">
  {#each $user_items as offer (offer.item.id)}
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
