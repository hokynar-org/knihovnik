<script lang="ts">
  import Item from '$lib/Item.svelte';
  import BorrowItem from '$lib/BorrowItem.svelte';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  export let data: PageData;
  $: user = data.user;
  $: item = data.item;
  $: owner = data.owner;
  $: holder = data.holder;
  $: last_requst = data.last_requst ? data.last_requst.borrow_request : null;
  $: borrow_requests = data.borrow_requests;
  $: community_visibility = data.community_visibility;
  let disabled = false;
</script>
