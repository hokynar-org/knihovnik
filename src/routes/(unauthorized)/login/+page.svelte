<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import FormBox from '../FormBox.svelte';
  import ModeSwitcher from '../ModeSwitcher.svelte';

  export let data;

  let loading = false;

  const { form, enhance, message } = superForm(data.form, {
    onSubmit: () => (loading = true),
    onResult: () => (loading = false),
  });
</script>

<FormBox subtitle="Login" {loading}>
  <form class="space-y-4" method="POST" action="?/login" use:enhance>
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
        type="password"
        name="password"
        bind:value={$form.password}
        id="password"
        placeholder=" "
      />
      <label for="password">Password</label>
    </div>

    <div class="form-group">
      <label for="stay"></label>
      <input type="checkbox" name="stay" bind:checked={$form.stay} id="stay" />
    </div>

    <button type="submit">Login</button>
  </form>

  {#if $message}
    <p class="p-1 text-red-500 text-sm text-center">{$message}</p>
  {/if}

  <ModeSwitcher href="/register" text="Don't have an account? Register now!" />
</FormBox>

<style lang="scss">
  @use '../forms.scss';
</style>
