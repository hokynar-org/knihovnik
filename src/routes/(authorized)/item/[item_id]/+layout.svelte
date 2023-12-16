<script lang="ts">
  import ItemDetail from '$lib/components/ItemDisplay/ItemDetail.svelte';
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  import type { PageData } from './$types';
  import type { last_request } from '$lib/types';
  export let data: PageData;
  import { page } from '$app/stores';
  $: user = data.user;
  $: item = data.item;
  $: owner = data.owner;
  $: holder = data.holder;
  $: last_requst = (
    data.last_requst ? data.last_requst.borrow_request : null
  ) as last_request | null;

  let isEdit = false;
  $: isEdit = String($page.url).includes('edit');

  let names = ['History', 'Edit'];
  let urls = ['', ''];
  $: if (item) {
    urls = ['/item/' + item.id + '/history', '/item/' + item.id + '/edit'];
  }
  let activeNo = 0;
</script>

<div class="container mt-6">
  <ItemDetail {item} {holder} {owner} {last_requst}></ItemDetail>
</div>

<div class="mt-6">
  {#if user.id == owner.id && holder && user.id == holder.id}
    <NavigationBar {names} {urls} bind:activeNo cls="text-xl" />
  {:else}
    <h2 class="text-2xl">History</h2>
  {/if}
</div>

<slot />
