<script lang="ts">
  import BorrowItem from '$lib/BorrowItem.svelte';
  import Item from '$lib/Item.svelte';
  export let data;
</script>

<div class="container">
  {#each data.offers as offer (offer.item.id)}
    <Item item={offer.item} owner={offer.owner} holder={null}>
      <!-- {#if offer.user != data.user}
        <BorrowItem borrow_request={offer.borrow_request} item={offer.item} />
      {/if} -->
    </Item>
  {/each}
</div>

<div class="results" />
