<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import Item from '$lib/Item.svelte';
  import { user_items } from '$lib/store';
  import { FileDropzone } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';
  import DeleteItem from '$lib/DeleteItem.svelte';
  import FileUploader from '$lib/components/FileUploader.svelte';
  import type { PageData } from './$types';
  export let data: PageData;

  const { form, enhance } = superForm(data.item_form);
  let files: string[] = [];
  $: filesSerialized = files.join(',');
  $: $form.files = filesSerialized;

  $: $user_items = data.user_items;
</script>

<div>
  <form method="POST" action="?/new_item" class="max-w-xs min-w-xs" use:enhance>
    <label for="name" class="text-xl mt-4 mb-2">Name</label>
    <input type="text" name="name" class="input" bind:value={$form.name} />

    <label for="description" class="text-xl mt-4 mb-2">Description</label>
    <textarea
      id="description"
      name="description"
      rows="4"
      class="input"
      bind:value={$form.description}
      style="resize: none;"
    />

    <input name="files" bind:value={filesSerialized} class="hidden" />
    <FileUploader bind:filenames={files} />

    <div class="flex content-center justify-center my-3">
      <button class="btn variant-filled-primary">Submit</button>
    </div>
  </form>
</div>

<div class="relative w-full">
  {#each $user_items as offer (offer.item.id)}
    <Item item={offer.item} owner={null} holder={offer.holder}>
      <div>
        <p>Location</p>
      </div>
      <div>
        <button class="btn variant-filled-primary py-1 my-2">Edit</button>
      </div>
      <div>
        <DeleteItem {offer} />
      </div>
    </Item>
  {/each}
</div>
