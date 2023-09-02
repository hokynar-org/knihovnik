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
  onMount(() => {
    console.log({ user, holder, owner });
  });
</script>

<div class="container">
  <Item {item}>
    {#if holder}
      {#if user.id != holder.id}
        <BorrowItem borrow_request={last_requst} {item} />
      {/if}
    {:else if user.id != owner.id}
      <BorrowItem borrow_request={last_requst} {item} />
    {/if}
  </Item>
</div>

<ol>
  {#each borrow_requests as borrow_request}
    <li>
      <a
        class="block p-4 hover:!bg-surface-300-600-token"
        href="/borrow_request/{borrow_request.borrow_request.id}"
      >
        <h4>
          {#if user.id == borrow_request.borrower.id}
            You requested {item.name} from user {borrow_request.lender
              .user_name}
          {:else if user.id == borrow_request.lender.id}
            User {borrow_request.borrower.user_name} requested {item.name} from you
          {:else}
            User {borrow_request.borrower.user_name} requested {item.name} from {borrow_request
              .lender.user_name}
          {/if}
          ({borrow_request.borrow_request.status})
        </h4>
      </a>
    </li>
  {/each}
</ol>
