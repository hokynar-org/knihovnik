<script lang="ts">
  import Item from '$lib/Item.svelte';
  import type { PublicItemSafe } from '$lib/types.js';
  export let data;
  $: user = data.user;
  $: item = data.item;
  $: owner = data.owner;
  $: holder = data.holder;
  $: last_requst = data.last_requst ? data.last_requst.borrow_request : null;
  $: borrow_requests = data.borrow_requests;
  $: community_visibility = data.community_visibility;
  let new_name = data.item.name;
  let new_description = data.item.description;
  let disabled = false;
  async function edit() {
    const response = await fetch('/api/item/' + item.id + '/edit', {
      method: 'POST',
      body: JSON.stringify({ name: new_name, description: new_description }),
    });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return (await response.json()) as PublicItemSafe;
  }
</script>

<div class="container">
  <Item {item} {holder} {owner} />
</div>
<div>
  <label for="name" class="text-xl mt-4 mb-2">Name</label>
  <input type="text" name="name" class="input" bind:value={new_name} />

  <label for="description" class="text-xl mt-4 mb-2">Description</label>
  <textarea
    id="description"
    name="description"
    rows="4"
    class="input"
    bind:value={new_description}
    style="resize: none;"
  />

  <div class="flex content-center justify-center my-3">
    <button
      class="btn variant-filled-primary"
      disabled={(new_name == item.name &&
        new_description == item.description) ||
        disabled}
      on:click={() => {
        disabled = true;
        const res = edit();
        res
          .then((value) => {
            item.name = value.name;
            item.description = value.description;
            disabled = false;
          })
          .catch(() => {
            disabled = false;
          });
      }}>Submit</button
    >
  </div>
</div>
