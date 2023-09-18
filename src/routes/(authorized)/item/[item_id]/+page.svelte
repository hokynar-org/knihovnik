<script>
  import { page } from '$app/stores';
  //import { page.svelte as history } from './history/+page.svelte';
  import Page from './history/+page.svelte';

  let isItem = false;
  $: isItem =
    !String($page.url).includes('edit') &&
    !String($page.url).includes('history');
</script>

{#if isItem}
  <Page data={$page.data} />
{/if}
