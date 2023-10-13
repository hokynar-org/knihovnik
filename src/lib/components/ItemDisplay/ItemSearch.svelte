<script lang="ts">
  import type { Offer } from '$lib/types';
  export let cls = '';
  export let offersFiltered: Offer[];
  let offersAll = offersFiltered; //backup

  export let searchTerm = '';
  $: console.log(searchTerm);
  $: console.log(offersFiltered);

  $: offersFiltered = offersAll.filter((offer) =>
    offer.item.name.includes(searchTerm),
  );
</script>

<div class="p-2 {cls}">
  <input class="input" type="text" bind:value={searchTerm} />
</div>
