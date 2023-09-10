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

  const { form, enhance } = superForm(data.community_form);
</script>

<div>
  <h2 class="text-2xl mt-6 mb-2">Create a community</h2>

  <p class="text-sm min-w-xs max-w-xs">
    Anyone can create a community and invite other users to it. Admins have a
    responsibility to moderate their community. TODO agree on this description
  </p>

  <form
    method="POST"
    action="?/new_community"
    class="max-w-xs min-w-xs"
    use:enhance
  >
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
    <label
      for="visibility"
      class="text-xl mt-4 mb-2 flex items-center space-x-2"
      ><span>Public visibility</span>
      <input
        type="checkbox"
        id="visibility"
        name="visibility"
        class="checkbox"
        bind:checked={$form.visibility}
      />
    </label>
    <div class="flex content-center justify-center my-3">
      <button class="btn variant-filled-primary">Submit</button>
    </div>
  </form>
</div>
