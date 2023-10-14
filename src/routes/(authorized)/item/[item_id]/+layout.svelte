<script lang="ts">
  import ItemDetail from '$lib/components/ItemDisplay/ItemDetail.svelte';
  import Item from '$lib/components/ItemDisplay/Item.svelte';
  import BorrowItem from '$lib/components/ItemDisplay/BorrowItem.svelte';
  import type { PageData } from './$types';
  import type { last_request } from '$lib/types';
  export let data: PageData;
  import { page } from '$app/stores';
  import OfferItem from '$lib/OfferItem.svelte';
  $: user = data.user;
  $: item = data.item;
  $: owner = data.owner;
  $: holder = data.holder;
  $: last_requst = (
    data.last_requst ? data.last_requst.borrow_request : null
  ) as last_request;

  let isEdit = false;
  $: isEdit = String($page.url).includes('edit');
</script>

<div class="container mt-6 mb-6">
  <ItemDetail {item} {holder} {owner} {last_requst}></ItemDetail>
</div>

{#if (user.id == owner.id && holder && holder.id == owner.id) || (item.transfeType == 'TRANSITIVE' && holder && user.id == holder.id)}
  <OfferItem {item} />
{/if}
<!--
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
-->

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
