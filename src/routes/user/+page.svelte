<script lang="ts">
  import type { PageData } from "./$types.d.ts";
  import { superForm } from "sveltekit-superforms/client";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  import { page } from "$app/stores";
  import { toggleTheme } from "$lib/colorTheme";
  export let data: PageData;

  const form = superForm(data.form).form;
  const form_password = superForm(data.form_password).form;

  $form.user_name = $page.data.user.user_name;
  $form.full_name = $page.data.user.full_name;
  $form.pronouns = $page.data.user.pronouns;
</script>

<!-- <SuperDebug data={$form} />

  <SuperDebug data={$form_password} /> -->
<table>
  {#each data.borrow_asks as ask (ask.id)}
    <tr>
      <td>
        {ask.id}
      </td>
      <td>
        {ask.item_id}
      </td>
      <td>
        {ask.borrower_id}
      </td>
    </tr>
  {/each}
</table>

<div class="container">
  <h4>
    Change info for user {$page.data.user.email}
  </h4>
  <div class="grid">
    <form method="POST" action="?/update">
      <label for="user_name">Username</label>
      <input type="text" name="user_name" bind:value={$form.user_name} />

      <label for="full_name">Name</label>
      <input type="text" name="full_name" bind:value={$form.full_name} />

      <label for="pronouns">Prefered pronouns</label>
      <input type="text" name="pronouns" bind:value={$form.pronouns} />

      <button>Save changes</button>
    </form>

    <form method="POST" action="?/update_password">
      <label for="old_password">Old Password</label>
      <input
        type="password"
        name="old_password"
        bind:value={$form_password.new_password}
      />

      <label for="new_password">New Password</label>
      <input
        type="password"
        name="new_password"
        bind:value={$form_password.old_password}
      />

      <button>Update password</button>
    </form>

    <button on:click={toggleTheme}>Toggle color theme</button>
  </div>
</div>
