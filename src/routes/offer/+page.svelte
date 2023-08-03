<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import UserItem from '$lib/UserItem.svelte';
  import NewItem from '$lib/NewItem.svelte';
  export let data;
  import { user_items } from '$lib/store';
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

<div class="container">
  {#each $user_items as item (item.id)}
    <UserItem {item} />
  {/each}
</div>

<style lang="scss">
  .container {
    position: relative;
    width: 100%;
  }
</style>
