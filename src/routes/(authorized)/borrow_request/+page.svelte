<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h2 class="text-4xl">History of borrow requests</h2>
<table class="mt-4 text-left">
  {#each [...data.borrow_requests].reverse() as borrow_request (borrow_request.borrow_request.id)}
    <tr>
      <th>
        <div class="mr-2">
          <h4 class="text-lg font-normal">
            {#if borrow_request.borrow_request.timestamp != null}
              {borrow_request.borrow_request.timestamp.toLocaleDateString()}
            {/if}
          </h4>
        </div>
      </th>
      <th>
        <h4 class="text-lg">
          <a
            class="block p-3 hover:!bg-surface-300-600-token"
            href="/borrow_request/{borrow_request.borrow_request.id}"
          >
            {#if data.user.id == borrow_request.borrower.id}
              You requested {borrow_request.item.name} from user {borrow_request
                .lender.user_name}
            {:else}
              User {borrow_request.borrower.user_name} requested {borrow_request
                .item.name} from you
            {/if}
          </a>
        </h4>
      </th>
    </tr>
  {/each}
</table>
