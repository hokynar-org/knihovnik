<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import Item from '$lib/Item.svelte';
  import { user_items } from '$lib/store';
  import { FileDropzone } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';
  import DeleteItem from '$lib/DeleteItem.svelte';
  import FileUploader from '$lib/components/FileUploader.svelte';
  import type { PageData } from './$types';
  import OfferItem from '$lib/OfferItem.svelte';
  export let data: PageData;
  $: user = data.user;

  $: $user_items = data.user_items;
</script>

<div class="relative w-full mt-6">
  <h2 class="text-4xl mx-4">Items you offered</h2>

  {#each $user_items as offer (offer.item.id)}
    <Item item={offer.item} owner={user} holder={offer.holder}>
      {#if offer.holder && user.id == offer.holder.id}
        <div>
          <a href={'/item/' + offer.item.id + '/edit'}>Edit</a>
        </div>
        <OfferItem item={offer.item} />
      {/if}
    </Item>
  {/each}
</div>
