<script lang="ts">
  import type {
    BorrowRequest,
    PublicItemSafe,
    PublicUserSafe,
  } from '../../types';
  export let borrow_request: BorrowRequest | null;
  export let item: PublicItemSafe;

  async function borrow() {
    const response = await fetch(
      '/api/borrow_request/' + '?item_id=' + item.id,
      {
        method: 'POST',
      },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return (await response.json()) as BorrowRequest;
  }
  async function cancel() {
    if (!borrow_request) {
      throw new Error('Nothing to cancel');
    }
    const response = await fetch(
      '/api/borrow_request/' + borrow_request.id + '/cancel',
      {
        method: 'POST',
      },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return (await response.json()) as BorrowRequest;
  }
  let disabled = false;
</script>

<div class="flex flex-col justify-between h-full">
  <div>
    {#if !borrow_request}
      <button
        class="btn variant-filled-primary py-1 my-2 w-24"
        on:click={() => {
          disabled = true;
          borrow()
            .then((value) => {
              borrow_request = value;
              disabled = false;
            })
            .catch((reson) => {
              disabled = false;
            });
        }}
        {disabled}>Borrow</button
      >
    {:else if borrow_request.status == 'PENDING'}
      <button
        class="btn variant-filled-error py-1 my-2 w-24"
        on:click={() => {
          disabled = true;
          cancel()
            .then((value) => {
              borrow_request = null;
              disabled = false;
            })
            .catch((reason) => {
              disabled = false;
            });
        }}
        {disabled}>Cancel</button
      >
    {/if}
  </div>
  <div>
    {#if borrow_request}
      Status: {borrow_request.status}
    {/if}
  </div>
</div>
