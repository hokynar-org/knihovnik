<script lang="ts">
  import Item from '$lib/Item.svelte';
  export let data;
</script>

<h4 class="mb-2 text-2xl">Vaše Polička</h4>
<h3 class="mb-6">Zde naleznete věci, které by se měly válet u Vás!</h3>
<div class="container">
  {#each data.offers as offer (offer.item.id)}
    <Item item={offer.item} owner={offer.owner} holder={null}></Item>
  {/each}
</div>

<div class="results" />
