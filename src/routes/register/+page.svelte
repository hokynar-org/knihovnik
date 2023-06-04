<script lang="ts">
  import type { PageData } from "./$types.d.ts";
  import { superForm } from "sveltekit-superforms/client";

  export let data: PageData;

  const { form, errors, constraints, enhance } = superForm(data.form);
</script>

<div>
  <form method="POST" use:enhance>
    <div class="form-group">
      <input
        type="text"
        name="user_name"
        bind:value={$form.user_name}
        id="user_name"
        {...$constraints.user_name}
      />
      <label for="user_name">Username</label>
      <small>{$errors.user_name ?? ""}</small>
    </div>

    <div class="form-group">
      <input
        type="password"
        name="password"
        bind:value={$form.password}
        id="password"
        {...$constraints.password}
      />
      <label for="password">Password</label>
      <small>{$errors.password ?? ""}</small>
    </div>

    <div class="form-group">
      <input
        type="email"
        name="email"
        bind:value={$form.email}
        id="email"
        {...$constraints.email}
      />
      <label for="email">E-mail</label>
      <small>{$errors.email ?? ""}</small>
    </div>

    <div class="form-group">
      <input
        type="text"
        name="full_name"
        bind:value={$form.full_name}
        id="full_name"
        {...$constraints.full_name}
      />
      <label for="full_name">Name</label>
      <small>{$errors.full_name ?? ""}</small>
    </div>

    <div class="form-group">
      <input
        type="text"
        name="pronouns"
        bind:value={$form.pronouns}
        id="pronouns"
        {...$constraints.pronouns}
      />
      <label for="pronouns">Prefferred pronouns</label>
      <small>{$errors.pronouns ?? ""}</small>
    </div>
    <div><button>Submit</button></div>
  </form>
</div>

<style lang="scss">
  @use "../forms.scss";
</style>
