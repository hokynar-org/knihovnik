<script lang="ts">
  import type { BorrowRequest, Offer, PublicUserSafe } from './types';
  export let offer: Offer;
  export let user: PublicUserSafe;
  async function borrow() {
    const response = await fetch(
      '/api/borrow_request/' + '?item_id=' + offer.item.id,
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
    if (!offer.borrow_request) {
      throw new Error('Nothing to cancel');
    }
    const response = await fetch(
      '/api/borrow_request/' + offer.borrow_request.id + '/cancel',
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

<div class="flex flex-col">
  {#if user.id != offer.user.id && !offer.borrow_request}
    <button
      class="btn variant-filled-primary py-1 my-2"
      on:click={() => {
        disabled = true;
        borrow()
          .then((value) => {
            offer.borrow_request = value;
            disabled = false;
          })
          .catch((reson) => {
            disabled = false;
          });
      }}
      {disabled}>Borrow</button
    >
  {/if}
  {#if offer.borrow_request && offer.borrow_request.status == 'PENDING'}
    <button
      class="btn variant-filled-primary py-1 my-2"
      on:click={() => {
        disabled = true;
        cancel()
          .then((value) => {
            offer.borrow_request = null;
            disabled = false;
          })
          .catch((reason) => {
            disabled = false;
          });
      }}
      {disabled}>Cancel</button
    >
  {/if}
  {#if offer.borrow_request}
    {offer.borrow_request.status}
  {/if}
</div>
