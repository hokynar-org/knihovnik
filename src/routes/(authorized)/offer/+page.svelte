<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import Item from '$lib/Item.svelte';
  import { user_items } from '$lib/store';
  import { FileDropzone } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';
  import DeleteItem from '$lib/DeleteItem.svelte';
  import FileUploader from '$lib/components/FileUploader.svelte';
  export let data;

  const item_form = superForm(data.item_form).form;

  $user_items = data.user_items;
</script>

<div>
  <form method="POST" action="?/new_item">
    <label for="name" class="text-xl mt-4 mb-2">Name</label>
    <input type="text" name="name" class="input" bind:value={$item_form.name} />

    <label for="description" class="text-xl mt-4 mb-2">Description</label>
    <textarea
      id="description"
      name="description"
      rows="4"
      class="input"
      bind:value={$item_form.description}
      style="resize: none;"
    />
    <FileUploader />
    <div class="flex content-center justify-center my-3">
      <button class="btn variant-filled-primary">Submit</button>
    </div>
  </form>
</div>

<div class="relative w-full">
  {#each $user_items as item (item.id)}
    <Item {item}>
      <div>
        <p>Location</p>
      </div>
      <div>
        <button class="btn variant-filled-primary py-1 my-2">Edit</button>
      </div>
      <div>
        <DeleteItem {item} />
      </div>
    </Item>
  {/each}
</div>
