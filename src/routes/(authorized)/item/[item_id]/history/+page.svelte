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

<div class="">
  <ol>
    {#each borrow_requests as borrow_request}
      <li>
        <a
          class="block p-4 hover:!bg-surface-300-600-token"
          href="/borrow_request/{borrow_request.borrow_request.id}"
        >
          {#if user.id == borrow_request.borrower.id}
            {borrow_request.lender.user_name} --> you
          {:else if user.id == borrow_request.lender.id}
            you --> {borrow_request.borrower.user_name}
          {:else}
            {borrow_request.lender.user_name} -->
            {borrow_request.borrower.user_name}
          {/if}
          {#if borrow_request.borrow_request.status != 'CONFIRMED'}
            ({borrow_request.borrow_request.status})
          {/if}
        </a>
      </li>
    {/each}
  </ol>
</div>
