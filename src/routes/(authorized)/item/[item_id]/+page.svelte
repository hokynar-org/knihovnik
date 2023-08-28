<script lang="ts">
  import Item from '$lib/Item.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="container">
  <Item item={data.offer.item} />
</div>
