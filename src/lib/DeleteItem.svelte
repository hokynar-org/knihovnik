<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import { user_items } from '$lib/store';
  import { onMount } from 'svelte';
  import type { PublicItemSafe } from './types';
  let files: FileList;
  export let data;

  const item_form = superForm(data.item_form).form;

  $user_items = data.user_items;

  onMount(() => {
    setInterval(() => {
      console.log(files);
    }, 1000);
  });

  let disabled = false;
  export let item: PublicItemSafe;

  async function deleteItem() {
    const response = await fetch('/api/item/' + item.id + '/remove', {
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
        const index = $user_items.indexOf(item);
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
