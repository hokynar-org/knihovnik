<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
  $: user = data.user;
  $: borrow_requests = data.borrow_requests;
</script>

<div class="mt-1">
  <ol>
    {#each [...borrow_requests].reverse() as borrow_request (borrow_request.borrow_request.id)}
      <li>
        <a
          class="block p-4 hover:!bg-surface-300-600-token"
          href="/borrow_request/{borrow_request.borrow_request.id}"
        >
          {#if borrow_request.borrow_request.timestamp != null}
            {borrow_request.borrow_request.timestamp.toDateString()}
          {/if}
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
  {#if borrow_requests.length == 0}
    <p class="text-lg mt-2">This item has no history.</p>
  {/if}
</div>
