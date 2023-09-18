<script lang="ts">
  import Item from '$lib/Item.svelte';
  import BorrowItem from '$lib/BorrowItem.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
  import { page } from '$app/stores';
  $: user = data.user;
  $: item = data.item;
  $: owner = data.owner;
  $: holder = data.holder;
  $: last_requst = data.last_requst ? data.last_requst.borrow_request : null;

  let isEdit = false;
  $: isEdit = String($page.url).includes('edit');
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
    <li class:text-2xl={!isEdit} class:text-xl={isEdit}>
      {#if !isEdit}
        History
      {:else}
        <a href={'/item/' + item.id + '/history'}>History</a>
      {/if}
    </li>
    {#if user.id == owner.id && holder && user.id == holder.id}
      <li class="crumb-separator text-{1.5}xl" aria-hidden>/</li>

      <li class="crumb" class:text-2xl={isEdit} class:text-xl={!isEdit}>
        {#if isEdit}
          Edit
        {:else}
          <a href={'/item/' + item.id + '/edit'}>Edit</a>
        {/if}
      </li>
    {/if}
  </ol>
</div>

<slot />
