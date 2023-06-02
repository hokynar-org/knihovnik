<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';
    import type { PageServerData } from './$types';
    export let data: PageServerData;
    const { form } = superForm(data.form);
</script>
<div class="container">
<h3>Login</h3>
<form method="POST" action="?/login">
    <label for="email">E-mail</label>
    <input type="email" name="email" bind:value={$form.email} />

    <label for="email">Password</label>
    <input type="password" name="password" bind:value={$form.password}>
    <fieldset>
        <label for="stay">
            <input type="checkbox" name="stay" bind:checked={$form.stay}>
            Stay logged in
        </label>
    </fieldset>

    <div>
        <button>
            Login
        </button>
    </div>

</form>
</div>