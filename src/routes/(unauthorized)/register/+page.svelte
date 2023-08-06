<script lang="ts" context="module">
  import { z } from 'zod';

  export const schema = z.object({
    user_name: z.string().min(2),
    full_name: z.string().min(1),
    password: z.string().min(4),
    // confirm: z.string().nonempty(),
    pronouns: z.string(),
    email: z.string().email().toLowerCase(),
  });
  // .refine((d) => d.password === d.confirm, {
  //   message: 'Passwords do not match',
  //   path: ['confirm'],
  // });
</script>

<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import FormBox from '../FormBox.svelte';
  import ModeSwitcher from '../ModeSwitcher.svelte';

  export let data;
  let loading = false;

  const { form, errors, message, constraints, enhance } = superForm(data.form, {
    onSubmit: () => (loading = true),
    onResult: () => (loading = false),
    validators: schema,
  });
</script>

<FormBox subtitle="Register" {loading}>
  <form class="space-y-2" method="POST" use:enhance>
    <label class="label">
      <span>E-mail</span>
      <input
        class="input"
        class:input-error={$errors.email}
        type="email"
        name="email"
        autocomplete="username"
        bind:value={$form.email}
        {...$constraints.email}
      />
      <p class="text-error-500">{$errors.email ?? ''}</p>
    </label>

    <label class="label">
      <span>Password</span>
      <input
        class="input"
        class:input-error={$errors.password}
        type="password"
        name="password"
        autocomplete="new-password"
        bind:value={$form.password}
        {...$constraints.password}
      />
      <p class="text-error-500">{$errors.password ?? ''}</p>
    </label>

    <!-- <label class="label">
      <span>Confirm password</span>
      <input
        class="input"
        class:input-error={$errors.confirm}
        type="password"
        name="confirm"
        autocomplete="new-password"
        bind:value={$form.confirm}
        {...$constraints.confirm}
      />
      <p class="text-error-500">{$errors.confirm ?? ''}</p>
    </label> -->

    <label class="label">
      <span>Username</span>
      <input
        class="input"
        class:input-error={$errors.user_name}
        type="text"
        name="user_name"
        autocomplete="nickname"
        bind:value={$form.user_name}
        {...$constraints.user_name}
      />
      <p class="text-error-500">{$errors.user_name ?? ''}</p>
    </label>

    <label class="label">
      <span>Name</span>
      <input
        class="input"
        class:input-error={$errors.full_name}
        type="text"
        name="full_name"
        autocomplete="name"
        bind:value={$form.full_name}
        {...$constraints.full_name}
      />
      <p class="text-error-500">{$errors.full_name ?? ''}</p>
    </label>

    <label class="label">
      <span>Prefferred pronouns</span>
      <input
        class="input"
        class:input-error={$errors.pronouns}
        type="text"
        name="pronouns"
        bind:value={$form.pronouns}
        {...$constraints.pronouns}
      />
      <p class="text-error-400-500-token">{$errors.pronouns ?? ''}</p>
    </label>

    <div class="flex justify-end !mt-4">
      <button class="btn variant-filled-primary" type="submit"> Submit </button>
    </div>
  </form>

  {#if $message}
    <p class="p-1 text-red-500 text-md text-center">{$message}</p>
  {/if}

  <ModeSwitcher
    href="/login"
    text="Already have an account? Log in!"
    darkMode={data.darkMode}
  />
</FormBox>

<style lang="scss">
  @use '../forms.scss';
</style>
