<script lang="ts">
  import type {
    BorrowRequest,
    PublicItemSafe,
    PublicUserSafe,
  } from '$lib/types';
  export let borrow_request: BorrowRequest | null;
  export let item: PublicItemSafe;
  import { page } from '$app/stores';
  $: user = $page.data.user as PublicUserSafe;
  let disabled = false;

  //Change borrow state
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

  function borrow_button_click() {
    disabled = true;
    borrow()
      .then((value) => {
        borrow_request = value;
        disabled = false;
      })
      .catch((reason) => {
        disabled = false;
      });
  }
</script>

<div class="flex flex-col justify-between h-full">
  <div>
    {#if !borrow_request}
      <button
        class="btn variant-filled-primary py-1 my-2 w-24"
        on:click={borrow_button_click}
        {disabled}
      >
        Borrow
      </button>
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
      <p>Status: {borrow_request.status}</p>
      {#if borrow_request.borrower_id === user.id}
        <button
          class="btn variant-filled-primary py-1 my-2 w-34"
          on:click={borrow_button_click}
          {disabled}
        >
          Request return
        </button>
      {/if}
    {/if}
  </div>
</div>
