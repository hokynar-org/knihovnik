<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';
  export let data: PageData;

  const { form, enhance } = superForm(data.community_form);
</script>

<div>
  <h2 class="text-4xl mt-6 mb-2">Create a community</h2>

  <p class="text-base min-w-sm max-w-sm">
    Anyone can create a community and invite other users to it. Admins have a
    responsibility to moderate their community. TODO agree on this description
  </p>

  <form
    method="POST"
    action="?/new_community"
    class="max-w-sm min-w-sm"
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
      <button class="btn variant-filled-primary">Submit</button>
    </div>
  </form>
</div>
