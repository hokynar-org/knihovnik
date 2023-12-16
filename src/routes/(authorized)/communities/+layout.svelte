<script lang="ts">
  import { page } from '$app/stores';
  import NavigationBar from '$lib/components/NavigationBar.svelte';

  let names = ['Your communities', 'Find a community', 'New community'];
  let urls = ['/communities', '/communities/search', '/communities/new'];
  let activeNo: number = 0;
</script>

<div class="">
  <NavigationBar {names} {urls} bind:activeNo />
</div>
<slot />
