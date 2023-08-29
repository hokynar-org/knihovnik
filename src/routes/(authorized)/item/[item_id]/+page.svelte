<script lang="ts">
  import Item from '$lib/Item.svelte';
  import BorrowItem from '$lib/BorrowItem.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  const offer = data.offer;
</script>

<div class="container">
  <Item item={offer.item}>
    {#if offer.user != data.user}
      <BorrowItem borrow_request={offer.borrow_request} item={offer.item} />
    {/if}
  </Item>
</div>
