<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import Item from '$lib/Item.svelte';
  import { user_items } from '$lib/store';
  import { FileDropzone } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';
  import DeleteItem from '$lib/DeleteItem.svelte';
  import FileUploader from '$lib/components/FileUploader.svelte';
  import type { PageData } from './$types';
  import OfferItem from '$lib/OfferItem.svelte';
  export let data: PageData;
  $: user = data.user;

  const { form, enhance } = superForm(data.item_form);
  let files: string[] = [];
  $: filesSerialized = files.join(',');
  $: $form.files = filesSerialized;

  $: $user_items = data.user_items;
</script>

<div class="mt-6">
  <h2 class="text-2xl">Offer an item</h2>

  <p class="text-sm min-w-xs max-w-xs">
    Add an item others can borrow. You will be able to choose which community
    can borrow it.
  </p>

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

    <label for="description" class="text-xl mt-4 mb-2">Picture</label>
    <div class="mb-4">
      <FileUploader bind:filenames={files} />
    </div>

    <div class="flex content-center justify-center my-3">
      <button class="btn variant-filled-primary">Submit</button>
    </div>
  </form>
</div>

<div class="relative w-full mt-6">
  <h2 class="text-4xl mx-4">Items you offered</h2>

  {#each $user_items as offer (offer.item.id)}
    <Item item={offer.item} owner={user} holder={offer.holder}>
      <div>
        <a href={'/item/' + offer.item.id + '/edit'}>Edit</a>
      </div>
      <OfferItem item={offer.item} />
    </Item>
  {/each}
</div>
