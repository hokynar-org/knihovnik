<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import FileUploader from '$lib/components/FileUploader.svelte';
  import type { PageData } from './$types';
  export let data: PageData;

  const { form, enhance } = superForm(data.item_form);
  let files: string[] = [];
  $: filesSerialized = files.join(',');
  $: $form.files = filesSerialized;
  $form.visibility = false;
</script>

<div class="mt-6">
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
    <div class="flex mt-4 mb-2">
      <label for="visibility" class="text-xl mr-4"
        >Visible to my communities</label
      >
      <input
        class="checkbox self-center"
        type="checkbox"
        name="visibility"
        bind:checked={$form.visibility}
      />
    </div>

    <div class="flex content-center justify-center my-3">
      <button class="btn variant-filled-primary">Submit</button>
    </div>
  </form>
</div>
