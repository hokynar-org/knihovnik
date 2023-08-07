<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import UserItem from '$lib/UserItem.svelte';
  import NewItem from '$lib/NewItem.svelte';
  import { user_items } from '$lib/store';

  export let data;

  const item_form = superForm(data.item_form).form;

  $user_items = data.user_items;
</script>

<div>
  <form method="POST" action="?/new_item">
    <label for="name">Name</label>
    <input type="name" name="name" bind:value={$item_form.name} />

    <label for="description">Description</label>
    <textarea
      id="description"
      name="description"
      rows="4"
      bind:value={$item_form.description}
      style="resize: none;"
    />
    <div><button>Submit</button></div>
  </form>
</div>
<!-- <div class="container">
  <NewItem />
</div> -->

<div class="relative w-full">
  {#each $user_items as item (item.id)}
    <UserItem {item} />
  {/each}
</div>
