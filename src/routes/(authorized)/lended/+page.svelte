<script lang="ts">
  import Item from '$lib/Item.svelte';

  export let data;
</script>

<div class="container">
  {#each data.offers as offer (offer.item.id)}
    <Item item={offer.item} />
  {/each}
</div>

<div class="results" />
