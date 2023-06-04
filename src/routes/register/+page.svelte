<script lang="ts">
  import type { PageData } from "./$types.d.ts";
  import { superForm } from "sveltekit-superforms/client";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

  export let data: PageData;

  // Client API:
  const { form } = superForm(data.form);
</script>

<!-- <SuperDebug data={$form} /> -->
<div>
  <form method="POST">
    <div class="form-group">
      <input
        type="text"
        name="username"
        bind:value={$form.user_name}
        id="username"
        placeholder=" "
      />
      <label for="username">Username</label>
    </div>

    <div class="form-group">
      <input
        type="email"
        name="email"
        bind:value={$form.email}
        id="email"
        placeholder=" "
      />
      <label for="email">E-mail</label>
    </div>

    <div class="form-group">
      <input
        type="text"
        name="name"
        bind:value={$form.full_name}
        id="name"
        placeholder=" "
      />
      <label for="name">Name</label>
    </div>

    <div class="form-group">
      <input
        type="text"
        name="prefferred pronouns"
        bind:value={$form.pronouns}
        id="pronouns"
        placeholder=" "
      />
      <label for="pronouns">Prefferred pronouns</label>
    </div>
    <div><button>Submit</button></div>
  </form>
</div>



<style lang="scss">
  @use "../forms.scss";
</style>