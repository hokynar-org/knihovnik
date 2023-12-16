<script>
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  import { page } from '$app/stores';
  let isNew = false;
  $: isNew = String($page.url).includes('new');

  let names = ['Items you offered', 'Offer na item'];
  let urls = ['/offer', '/offer/new'];
  let activeNo = 0;
</script>

<NavigationBar {names} {urls} bind:activeNo cls="text-2xl" />

<slot />
