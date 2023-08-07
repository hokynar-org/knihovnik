<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import { page } from '$app/stores';
  import { notifications, notifications_a } from '$lib/store';
  import type { PageData } from './$types';
  import NotificationBorrowRequest from '$lib/NotificationBorrowRequest.svelte';
  import NotificationBorrowRequest_a from '$lib/NotificationBorrowRequest a.svelte';

  export let data: PageData;

  const form = superForm(data.form).form;
  const form_password = superForm(data.form_password).form;

  $notifications = data.notifications;
  $notifications_a = data.notifications_a;

  $form.user_name = $page.data.user.user_name;
  $form.full_name = $page.data.user.full_name;
  $form.pronouns = $page.data.user.pronouns;
</script>

<!-- <SuperDebug data={$form} />

  <SuperDebug data={$form_password} /> -->

<div>
  {#each $notifications as notification}
    <NotificationBorrowRequest {notification} />
  {/each}

  {#each $notifications_a as notification}
    <NotificationBorrowRequest_a {notification} />
  {/each}
</div>

<div class="container">
  <h3 class="h3 my-2">
    Change info for user {$page.data.user.email}
  </h3>

  <div class="space-y-8">
    <form
      method="POST"
      action="?/update"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <label class="label">
        <span>Username</span>
        <input
          class="input"
          type="text"
          name="user_name"
          bind:value={$form.user_name}
        />
      </label>

      <label class="label">
        <span>Name</span>
        <input
          class="input"
          type="text"
          name="full_name"
          bind:value={$form.full_name}
        />
      </label>

      <label class="label">
        <span>Prefered pronouns</span>
        <input
          class="input"
          type="text"
          name="pronouns"
          bind:value={$form.pronouns}
        />
      </label>

      <div class="self-end justify-self-center col-span-full">
        <button class="btn variant-filled-primary">Save changes</button>
      </div>
    </form>

    <form
      method="POST"
      action="?/update_password"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
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
