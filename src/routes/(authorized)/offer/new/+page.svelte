<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import FileUploader from '$lib/components/Forms/FileUploader.svelte';
  import type { PageData } from './$types';
  import IconSelector from '$lib/components/IconSelector/IconSelector.svelte';
  import OptionPicker from '$lib/components/Forms/OptionPicker.svelte';
  import PickBorrowType from '$lib/components/Forms/PickBorrowType.svelte';
  import {
    faHandHoldingHand,
    faHandHolding,
    faHandsHolding,
  } from '@fortawesome/free-solid-svg-icons';
  import type { BorrowMode } from '$lib/types';
  export let data: PageData;

  const { form, enhance } = superForm(data.item_form);
  let fileName: string | null = null;
  let selectedIconName: string | null;
  let transferType: BorrowMode;
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
  <p class="text-base min-w-sm max-w-sm">
    Add an item others can borrow. You will be able to choose which community
    can borrow it.
  </p>

  <p>* = mandatory</p>

  <form
    method="POST"
    action="?/new_item"
    class="max-w-sm min-w-sm"
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
    <PickBorrowType bind:selectedType={transferType} />
    <input name="transferType" bind:value={transferType} class="hidden" />
    <input name="files" bind:value={fileName} class="hidden" />
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
        <FileUploader bind:fileName />
      {:else}
        <IconSelector bind:selectedIconName />
      {/if}
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
