<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import UserItem from '$lib/UserItem.svelte';
  import NewItem from '$lib/NewItem.svelte';
  import { user_items } from '$lib/store';
  import { FileDropzone } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';
  let files: FileList;
  export let data;

  const item_form = superForm(data.item_form).form;

  $user_items = data.user_items;

  onMount(() => {
    setInterval(() => {
      console.log(files);
    }, 1000);
  });
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
    <div class="flex content-center justify-center my-3">
      <button class="btn variant-filled-primary">Submit</button>
    </div>
  </form>
  <FileDropzone name="picture" bind:files />
</div>

<div class="relative w-full">
  {#each $user_items as item (item.id)}
    <UserItem {item} />
  {/each}
</div>
