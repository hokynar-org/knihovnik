<script lang="ts">
  import type { PageData } from './$types.d.ts';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data: PageData;

  // Client API:
  const { form } = superForm(data.form);
</script>

<SuperDebug data={$form} />

Yo lemme hop in here real quick
<div class=container>

<form method="POST">
  <label for="username">Username</label>
  <input type="text" name="username" bind:value={$form.username} />

  <label for="email">E-mail</label>
  <input type="email" name="email" bind:value={$form.email} />

  <label for="name">Name</label>
  <input type=text name="name" bind:value={$form.name} />

  <label for="pronouns">Prefered pronouns</label>
  <input type="text" name="pronouns" bind:value={$form.pronouns} placeholder="they/them" />

  <div><button>Submit</button></div>
</form>
</div>
