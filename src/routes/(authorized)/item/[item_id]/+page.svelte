<script lang="ts">
  import { page } from '$app/stores';
  //import { page.svelte as history } from './history/+page.svelte';
  import History from './history/+page.svelte';
  export let data;

  let isItem = false;
  $: isItem =
    !String($page.url).includes('edit') &&
    !String($page.url).includes('history');
</script>

{#if isItem}
  <History {data} />
{/if}
