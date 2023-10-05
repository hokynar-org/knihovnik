<script lang="ts">
  import Item from '$lib/components/ItemDisplay/Item.svelte';
  import ItemGrid from '$lib/components/ItemDisplay/ItemGrid.svelte';
  import ItemCard from '$lib/components/ItemDisplay/ItemCard.svelte';
  import Fa from 'svelte-fa';
  import {
    faCheck,
    faXmark,
    faClock,
    faUser,
  } from '@fortawesome/free-solid-svg-icons';
  import type { PublicItemSafe, PublicUserSafe } from '$lib/types';
  import { page } from '$app/stores';
  $: user = $page.data.user as PublicUserSafe;

  export let data;
</script>

<h4 class="mb-2 text-4xl">Vaše Polička</h4>
<h3 class="mb-6">Zde naleznete věci, které by se měly válet u Vás!</h3>

<ItemGrid>
  {#each data.offers as offer (offer.item.id)}
    <ItemCard item={offer.item} owner={offer.owner} holder={null}>
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
        {:else if !offer.item.offered && offer.owner && offer.owner.id == user.id}
          <div class="flex items-baseline">
            <p><Fa icon={faXmark} /></p>
            <p class="pl-2">You have unlisted this item</p>
          </div>
        {:else if !offer.item.offered && offer.owner && offer.owner.id != user.id}
          <div class="flex items-baseline">
            <p><Fa icon={faClock} /></p>
            <p class="pl-2">You borrowed this item</p>
          </div>
        {/if}
      </div>
    </ItemCard>
  {/each}
</ItemGrid>
