<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import ReadOnlyTextInput from '$lib/components/EditingInput/ReadOnlyTextInput.svelte';
  import ReadOnlyTextFieldInput from '$lib/components/EditingInput/ReadOnlyTextFieldInput.svelte';
  import { afterUpdate, onMount } from 'svelte';

  export let data: PageData;

  const { form, errors } = superForm(data.form);
  const form_password = superForm(data.form_password).form;

  $: $form.user_name = $page.data.user.user_name;
  $: $form.full_name = $page.data.user.full_name;
  $: $form.pronouns = $page.data.user.pronouns;
  $: $form.bio = $page.data.user.bio;
  const old_user_name = $page.data.user.user_name;
  const old_full_name = $page.data.user.full_name;
  const old_pronouns = $page.data.user.pronouns;
  const old_bio = $page.data.user.bio;

  $: disabled =
    old_user_name == $form.user_name &&
    old_full_name == $form.full_name &&
    old_pronouns == $form.pronouns &&
    old_bio == $form.pronouns;
</script>

<div class="w-xs">
  <h3 class="h3 my-2">
    Change info for user {$page.data.user.email}
  </h3>

  <div class="space-y-8">
    <form method="POST" action="?/update" class="grid grid-cols-1 gap-4">
      <ReadOnlyTextInput
        name="user_name"
        label="Username"
        error={$errors.user_name}
        bind:value={$form.user_name}
      />

      <ReadOnlyTextInput
        name="full_name"
        label="Name"
        error={$errors.full_name}
        bind:value={$form.full_name}
      />

      <ReadOnlyTextInput
        name="pronouns"
        label="Prefered pronouns"
        error={$errors.pronouns}
        bind:value={$form.pronouns}
      />

      <ReadOnlyTextFieldInput
        name="bio"
        label="Bio"
        error={$errors.bio}
        bind:value={$form.bio}
      />
      <div class="self-end justify-self-center col-span-full">
        <button {disabled} class="btn variant-filled-primary"
          >Save changes</button
        >
      </div>
    </form>
    <h3 class="h3 my-2">Change Password</h3>
    <form
      method="POST"
      action="?/update_password"
      class="grid grid-cols-1 gap-4"
    >
      <label class="label">
        <span>Old Password</span>
        <input
          class="input"
          type="password"
          name="old_password"
          bind:value={$form_password.new_password}
        />
      </label>

      <label class="label">
        <span>New Password</span>
        <input
          class="input"
          type="password"
          name="new_password"
          bind:value={$form_password.old_password}
        />
      </label>

      <div class="self-end justify-self-center col-span-full">
        <button class="btn variant-filled-primary">Update password</button>
      </div>
    </form>
  </div>
</div>
