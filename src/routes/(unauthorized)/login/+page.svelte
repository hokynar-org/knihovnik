<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import FormBox from '../FormBox.svelte';
  import ModeSwitcher from '../ModeSwitcher.svelte';

  export let data;

  let loading = false;

  const { form, enhance, message, errors } = superForm(data.form, {
    onSubmit: () => (loading = true),
    onResult: () => (loading = false),
  });
</script>

<FormBox subtitle="Login" {loading}>
  <form class="space-y-2" method="POST" action="?/login" use:enhance>
    <label class="label">
      <span>E-mail</span>
      <input
        class="input"
        type="email"
        name="email"
        bind:value={$form.email}
        id="email"
        placeholder=" "
      />
      <p class="text-error-300-500-token">{$errors.email ?? ''}</p>
    </label>

    <label class="label">
      <span>Password</span>
      <input
        class="input"
        type="password"
        name="password"
        bind:value={$form.password}
        id="password"
        placeholder=" "
      />
      <p class="text-error-400-500-token">{$errors.password ?? ''}</p>
    </label>

    <label class="flex items-center w-full !mt-4">
      <input
        type="checkbox"
        class="checkbox mr-2"
        name="stay"
        bind:checked={$form.stay}
        id="stay"
      />
      <p>Stay logged in</p>

      <button class="ml-auto btn variant-filled-primary" type="submit">
        Login
      </button>
    </label>
  </form>

  {#if $message}
    <p class="p-1 text-error-600-300-token text-center">{$message}</p>
  {/if}

  <ModeSwitcher darkMode={data.darkMode}>
    <div>
      <a class="underline" href="/reset/password">
        <span class="font-normal">Forgot your password?</span> Reset it
      </a>
    </div>
    <div>
      <a class="underline" href="/register">
        <span class="font-normal">Don't have an account?</span> Register now!
      </a>
    </div>
  </ModeSwitcher>
</FormBox>

<style lang="scss">
  @use '../forms.scss';
</style>
