<script lang="ts">
  import type { BorrowRequest, PublicItemSafe, PublicUserSafe } from './types';
  export let item: PublicItemSafe;
  import { user_items } from '$lib/store';
  $: items = $user_items.flatMap((value) => {
    return value.item;
  });

  async function offer() {
    const response = await fetch('/api/item/' + String(item.id) + '/offer', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return (await response.json()) as boolean;
  }
  let disabled = false;
</script>

<div class="flex flex-col justify-between h-full">
  <div>
    {#if !item.offered}
      <button
        class="btn variant-filled-primary py-1 my-2 w-24"
        on:click={() => {
          disabled = true;
          offer()
            .then((value) => {
              item.offered = value;
              const index = items.indexOf(item);
              $user_items[index].item = item;
              disabled = false;
            })
            .catch((reson) => {
              disabled = false;
            });
        }}
        {disabled}>Offer</button
      >
    {:else}
      <button
        class="btn variant-filled-error py-1 my-2 w-24"
        on:click={() => {
          disabled = true;
          offer()
            .then((value) => {
              item.offered = value;
              const index = items.indexOf(item);
              $user_items[index].item = item;
              disabled = false;
            })
            .catch((reson) => {
              disabled = false;
            });
        }}
        {disabled}>Unlist</button
      >
    {/if}
  </div>
</div>
