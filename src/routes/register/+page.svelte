<script lang="ts">
  import type { PageData } from './$types.d.ts';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data: PageData;

  // Client API:
  const { form } = superForm(data.form);
</script>

<style>
  /* Center the form container */
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    width: 100%;
    height: 100vh;
  }
  
  /* Style the form group */
  .form-group {
    position: relative;
    margin-bottom: 0.5rem;
  }

  /* Style form elements */
  input {
    padding: 1.0rem;
    width: 100%;
    border: 0.1px solid gray;
    border-radius: 5px;
    background: none;
    transition: all 0.2s ease;
  }

  input:focus + label, input:not(:placeholder-shown) + label{
    top: -1rem;
    left: 0;
    color: #007bff;
    font-size: 0.75rem;
  }

  label {
    position: absolute;
    top: 0.7rem;
    left: 0.7rem;
    color: gray;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  button {
    padding: 0.4rem 1.5rem;
    background-color: #017da3;
    color: white;
    border: none;
    border-radius: 5px;
  }
</style>

<!-- <SuperDebug data={$form} /> -->
<div>
<form method="POST">
  <div class="form-group">
    <input type    ="text" name="username" bind:value={$form.username} id="username" placeholder=" " />
    <label for="username">Username</label>
  </div>

  <div class="form-group">
    <input type="email" name="email" bind:value={$form.email} id="email" placeholder=" " />
    <label for="email">E-mail</label>
  </div>

  <div class="form-group">
    <input type="text" name="name" bind:value={$form.name} id="name" placeholder=" " />
    <label for="name">Name</label>
  </div>

  <label for="pronouns">Prefered pronouns</label>
  <input type="text" name="pronouns" bind:value={$form.pronouns} placeholder="they/them" />

  <div><button>Submit</button></div>
</form>
</div>
