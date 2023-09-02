<script lang="ts">
  import Item from '$lib/Item.svelte';
  export let data;
</script>

<h4>Vaše Polička</h4>
<h3>Zde naleznete věci, které by se měli válet u Vás!</h3>
<div class="container">
  {#each data.offers as offer (offer.item.id)}
    <Item item={offer.item}></Item>
  {/each}
</div>

<div class="results" />
