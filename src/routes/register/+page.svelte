<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";

  export let data;

  const { form, errors, message, constraints, enhance } = superForm(data.form);
</script>

<div class="center-content">
  <form method="POST" use:enhance>
    <div class="form-group">
      <input
        type="email"
        name="email"
        bind:value={$form.email}
        id="email"
        placeholder=" "
        {...$constraints.email}
      />
      <label for="email">E-mail</label>
      <p>{$errors.email ?? ""}</p>
    </div>

    <div class="form-group">
      <input
        type="password"
        name="password"
        bind:value={$form.password}
        id="password"
        placeholder=" "
        {...$constraints.password}
      />
      <label for="password">Password</label>
      <p>{$errors.password ?? ""}</p>
    </div>

    <div class="form-group">
      <input
        type="text"
        name="user_name"
        bind:value={$form.user_name}
        id="user_name"
        placeholder=" "
        {...$constraints.user_name}
      />
      <label for="user_name">Username</label>
      <p>{$errors.user_name ?? ""}</p>
    </div>

    <div class="form-group">
      <input
        type="text"
        name="full_name"
        bind:value={$form.full_name}
        id="full_name"
        placeholder=" "
        {...$constraints.full_name}
      />
      <label for="full_name">Name</label>
      <p>{$errors.full_name ?? ""}</p>
    </div>

    <div class="form-group">
      <input
        type="text"
        name="pronouns"
        bind:value={$form.pronouns}
        id="pronouns"
        placeholder=" "
        {...$constraints.pronouns}
      />
      <label for="pronouns">Prefferred pronouns</label>
      <p>{$errors.pronouns ?? ""}</p>
    </div>
    <div><button type="submit">Submit</button></div>
    {#if $message}
      <p style="font-size: medium">{$message}</p>
    {/if}
  </form>
</div>

<style lang="scss">
  @use "../forms.scss";

  .center-content {
    margin-block: auto;
  }
</style>
