<script lang="ts">
  import { user_items } from '$lib/store';
  import type { UserOffer } from '../../../types';
  export let offer: UserOffer;

  let disabled = false;

  async function deleteItem() {
    const response = await fetch('/api/item/' + offer.item.id + '/remove', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
  }
</script>

<button
  class="btn variant-filled-error py-1 my-2"
  on:click={() => {
    disabled = true;
    deleteItem()
      .then((value) => {
        const index = $user_items.indexOf(offer);
        if (index > -1) {
          $user_items.splice(index, 1);
          $user_items = $user_items; // důležité pro Svelte
        }
      })
      .catch((reson) => {
        disabled = false;
      });
  }}
  {disabled}
>
  Delete</button
>
