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
    <input name="hash" value={data.hash} hidden />
    <label class="label">
      <span>New password</span>
      <input
        class="input"
        type="password"
        name="password"
        bind:value={$form.password}
        placeholder=" "
      />
      <p class="text-error-300-500-token">{$errors.password ?? ''}</p>
    </label>
    <label class="label">
      <span>Repeat password</span>
      <input
        class="input"
        type="password"
        name="password2"
        bind:value={$form.password2}
        placeholder=" "
      />
      <p class="text-error-300-500-token">{$errors.password2 ?? ''}</p>
    </label>

    <label class="flex items-center w-full !mt-4">
      <button class="ml-auto btn variant-filled-primary" type="submit">
        Change password
      </button>
    </label>
  </form>

  {#if $message}
    <p class="p-1 text-error-600-300-token text-center">{$message}</p>
  {/if}
</FormBox>
