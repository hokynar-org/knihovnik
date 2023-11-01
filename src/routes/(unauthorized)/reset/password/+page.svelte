<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import FormBox from '../../FormBox.svelte';
  // import ModeSwitcher from '../../ModeSwitcher.svelte';

  export let data;

  let loading = false;

  const { form, enhance, message, errors } = superForm(data.form, {
    onSubmit: () => (loading = true),
    onResult: () => (loading = false),
  });
</script>

<FormBox subtitle="Password reset" {loading}>
  <form class="space-y-2" method="POST" action="?/reset" use:enhance>
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

    <label class="flex items-center w-full !mt-4">
      <button class="ml-auto btn variant-filled-primary" type="submit">
        Confirm e-mail
      </button>
    </label>
  </form>

  {#if $message}
    <p class="p-1 text-error-600-300-token text-center">{$message}</p>
  {/if}

  <!-- <ModeSwitcher
    href="/register"
    text="Don't have an account? Register now!"
    darkMode={data.darkMode}
  /> -->
</FormBox>
