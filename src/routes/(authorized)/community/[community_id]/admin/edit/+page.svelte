<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  export let data;
  const { form, enhance } = superForm(data.community_form);
  $: $form.name = data.community.name;
  $: $form.description = data.community.description;
  $: $form.visibility = data.community.visibility;
</script>

<div>
  <h2 class="text-4xl mt-6 mb-2">Edit this community</h2>
  <form method="POST" action="?/edit_community" class="max-w-sm min-w-sm">
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
    >
      <div>
        <span class="text-xl">Public visibility</span>
        <p class="text-base max-w-[80%]">
          People will be able to search for this community and request to join
          it. You can change this later.
        </p>
      </div>
      <input
        type="checkbox"
        id="visibility"
        name="visibility"
        class="checkbox"
        bind:checked={$form.visibility}
      />
    </label>
    <div class="flex content-center justify-center my-6">
      <button
        type="submit"
        class="btn variant-filled-primary"
        disabled={$form.name == data.community.name &&
          $form.description == data.community.description &&
          $form.visibility == data.community.visibility}>Submit</button
      >
    </div>
  </form>
</div>

<div>
  <h2 class="text-4xl mt-6 mb-2 min-w-sm max-w-sm">Delete this community</h2>
  <form method="POST" action="?/delete_community" class="w-full">
    <div class="flex content-center justify-center my-6 w-full">
      <button type="submit" class="btn variant-filled-error">Delete</button>
    </div>
  </form>
</div>
