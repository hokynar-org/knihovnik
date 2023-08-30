<script lang="ts">
  import Item from '$lib/Item.svelte';
  import BorrowItem from '$lib/BorrowItem.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  const offer = data.offer;
</script>

<div class="container">
  <Item item={offer.item}>
    {#if offer.user != data.user}
      <BorrowItem borrow_request={offer.borrow_request} item={offer.item} />
    {/if}
  </Item>
</div>

<ol>
  {#each data.borrow_requests as borrow_request}
    <li>
      <a
        class="block p-4 hover:!bg-surface-300-600-token"
        href="/borrow_request/{borrow_request.borrow_request.id}"
      >
        <h4>
          {#if data.user.id == borrow_request.borrower.id}
            You requested {borrow_request.item.name} from user {borrow_request
              .lender.user_name}
          {:else}
            User {borrow_request.borrower.user_name} requested {borrow_request
              .item.name} from you
          {/if}
          ({borrow_request.borrow_request.status})
        </h4>
      </a>
    </li>
  {/each}
</ol>
