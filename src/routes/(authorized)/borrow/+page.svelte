<script lang="ts">
  import BorrowItem from '$lib/BorrowItem.svelte';
  import Item from '$lib/Item.svelte';
  export let data;
</script>

<div>
  <h2 class="text-4xl mx-4">Items you can borrow</h2>
</div>

<div class="results mt-4">
  {#each data.offers as offer (offer.item.id)}
    <Item item={offer.item} owner={offer.owner} holder={null}>
      <!-- {#if offer.user != data.user}
        <BorrowItem borrow_request={offer.borrow_request} item={offer.item} />
      {/if} -->
    </Item>
  {/each}
  {#if data.offers.length == 0}
    <p>There are no items you can borrow right now :/</p>
  {/if}

  <!--TODO: make it so that items you yourself have offered are not displayed here-->
</div>

<div />
