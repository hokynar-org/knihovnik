<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import Item from '$lib/components/ItemDisplay/Item.svelte';
  import ItemCard from '$lib/components/ItemDisplay/ItemCard.svelte';
  import { user_items } from '$lib/store';
  import { FileDropzone } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';
  import DeleteItem from '$lib/components/ItemDisplay/DeleteItem.svelte';
  import FileUploader from '$lib/components/FileUploader.svelte';
  import type { PageData } from './$types';
  import OfferItem from '$lib/OfferItem.svelte';
  export let data: PageData;
  $: user = data.user;

  $: $user_items = data.user_items;

  let containerWidth = 1;
  let fontSize = 16; //1 rem = this much px

  //Choose a maximum amount of rows, but have the width be fit to the rows.
  //A horrible solution that doesn't update often
  //desired width:
  //n * 20rem + (n-1)1.5rem = n*(21.5rem) - 1.5rem
  //Equation:
  //n*(21.5rem) - 1.5rem = maxwidth -> and then n floor
  $: maxwidth = containerWidth * 0.95;
  $: n = Math.floor((maxwidth + 1.95 * fontSize) / (21.5 * fontSize));
  $: width = (n * 21.5 - 1.5) * fontSize;
  //$: console.log('n: ' + String(n));
  //$: console.log('width: ' + String(width));
  //$: console.log('font-size: ' + String(fontSize));
  onMount(() => {
    const reference = document.getElementById('measuring');
    if (reference) {
      containerWidth = reference.clientWidth;
      //console.log(containerWidth);
      const computedStyle = window.getComputedStyle(reference);
      fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
    }
  });
</script>

<div id="measuring" class="w-[100%]"></div>
<div class="flex flex-wrap flex-shrink w-[{width}px] mt-6 gap-6">
  {#each $user_items as offer (offer.item.id)}
    <ItemCard item={offer.item} owner={user} holder={offer.holder}>
      {#if offer.holder && user.id == offer.holder.id}
        <div class="flex flex-wrap items-baseline">
          <div class="mx-auto">
            <a href={'/item/' + offer.item.id + '/edit'}>Edit</a>
          </div>
          <div class="mx-auto">
            <OfferItem item={offer.item} />
          </div>
        </div>
      {/if}
    </ItemCard>
  {/each}
</div>
