<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import FileUploader from '$lib/components/FileUploader.svelte';
  import type { PageData } from './$types';
  import IconSelector from '$lib/components/IconSelector/IconSelector.svelte';
  import OptionPicker from '$lib/components/OptionPicker.svelte';
  import {
    faHandHoldingHand,
    faHandHolding,
    faHandsHolding,
  } from '@fortawesome/free-solid-svg-icons';
  export let data: PageData;

  const { form, enhance } = superForm(data.item_form);
  let files: string[] = [];
  let selectedIconName: string | null;
  let transferType: string;
  $: filesSerialized = files.join(',');
  $: $form.files = filesSerialized;
  $: $form.hasMainPic = hasMainPic;
  $: $form.iconName = selectedIconName;
  // $: console.log(hasMainPic, selectedIconName, $form.iconName);
  $form.visibility = false;

  let hasMainPic = true;
  function changeMain(): void {
    hasMainPic = !hasMainPic;
    if (hasMainPic) selectedIconName = null;
  }
</script>

<div class="mt-6">
  <p class="text-base min-w-xs max-w-xs">
    Add an item others can borrow. You will be able to choose which community
    can borrow it.
  </p>

  <p>* = mandatory</p>

  <form
    method="POST"
    action="?/new_item"
    class="max-w-xs min-w-xs"
    use:enhance
    enctype="multipart/form-data"
  >
    <label for="name" class="text-xl mt-4 mb-2">Name*</label>
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
    <label for="transferType" class="text-xl mt-4 mb-2">Transfer Type</label>
    <OptionPicker
      options={['Borrow', 'Transitive', 'Give']}
      emojis={[faHandHolding, faHandHoldingHand, faHandsHolding]}
      bind:selected={transferType}
    />
    <input name="transferType" bind:value={transferType} class="hidden" />
    <input name="files" bind:value={filesSerialized} class="hidden" />
    <input name="hasMainPic" bind:value={hasMainPic} class="hidden" />
    <input name="iconName" bind:value={selectedIconName} class="hidden" />
    <label for="description" class="text-xl mt-4">Main picture*</label>
    <p class="mt-1">This will be used for thumbnails.</p>

    <div class="flex content-center justify-center mt-2">
      <ol class="breadcrumb w-auto">
        <li class:text-lg={hasMainPic} class:text-base={!hasMainPic}>
          {#if hasMainPic}
            Upload
          {:else}
            <button class="font-bold" on:click={changeMain}>Upload</button>
          {/if}
        </li>
        <li class="crumb-separator text-lg" aria-hidden>/</li>

        <li class:text-lg={!hasMainPic} class:text-base={hasMainPic}>
          {#if !hasMainPic}
            Presets
          {:else}
            <button class="font-bold" on:click={changeMain}>Presets</button>
          {/if}
        </li>
      </ol>
    </div>

    <div class="mb-4 mt-3">
      {#if hasMainPic}
        <FileUploader bind:filenames={files} />
      {:else}
        <IconSelector bind:selectedIconName />
      {/if}
    </div>

    <label for="description" class="text-xl mt-4">Other pictures</label>
    <p class="mt-1">Show important details of the item.</p>
    <div class="mb-4 mt-2">
      <FileUploader bind:filenames={files} />
    </div>

    <div class="flex mt-4 mb-2">
      <div>
        <label for="visibility" class="text-xl mr-4"
          >Visible to my communities</label
        >
        <p class="text-base max-w-[80%]">
          People in <strong>all</strong> my communities will see this item and will
          be able to request to borrow it. You can change this later (and for individual
          communities).
        </p>
      </div>

      <input
        class="checkbox self-center"
        type="checkbox"
        name="visibility"
        bind:checked={$form.visibility}
      />
    </div>

    <div class="flex content-center justify-center my-6">
      <button type="submit" class="btn variant-filled-primary">Submit</button>
    </div>
  </form>
</div>
