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
    <label for="name" class="text-lg">Name</label>
    <input type="name" name="name" bind:value={$item_form.name} />

    <label for="description" class="text-lg mt-2">Description</label>
    <textarea
      id="description"
      name="description"
      rows="4"
      bind:value={$item_form.description}
      style="resize: none;"
    />
    <div class="flex content-center justify-center">
      <button
        class="px-3 py-2 my-2 text-lg rounded-container-token bg-primary-500"
        >Submit</button
      >
    </div>
  </form>
  <FileDropzone name="picture" bind:files />
</div>

<div class="relative w-full">
  {#each $user_items as item (item.id)}
    <UserItem {item} />
  {/each}
</div>
