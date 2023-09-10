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
  $: borrow_requests = data.borrow_requests;
  $: community_visibility = data.community_visibility;
  let disabled = false;
  $: last_requst = data.last_requst ? data.last_requst.borrow_request : null;
</script>

<div class="container mt-6 mb-6">
  <Item {item} {holder} {owner}>
    {#if holder}
      {#if user.id != holder.id}
        <BorrowItem borrow_request={last_requst} {item} />
      {/if}
    {:else if user.id != owner.id}
      <BorrowItem borrow_request={last_requst} {item} />
    {/if}
  </Item>
</div>
<div>
  <ol class="breadcrumb">
    <li class="crumb">
      <a class="anchor" href={'/item/' + item.id + '/history'}>History</a>
    </li>
    {#if user.id == owner.id && holder && user.id == holder.id}
      <li class="crumb-separator" aria-hidden>/</li>

      <li class="crumb">
        <a class="anchor" href={'/item/' + item.id + '/edit'}>Edit</a>
      </li>
    {/if}
  </ol>
</div>

<slot />
