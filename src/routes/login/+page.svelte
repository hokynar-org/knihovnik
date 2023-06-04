<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';
    import type { PageServerData } from './$types';
    export let data: PageServerData;
    const { form } = superForm(data.form);
</script>

<div class="container">
<h3>Login</h3>


    <form method="POST" action="?/login">
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
        <input
          type="checkbox"
          name="stay"
          bind:checked={$form.stay}
          id="stay"
        />
        <label for="stay"></label>
      </div>


  
      <div><button>Login</button></div>
    </form>


</div>

<style lang="scss">
    @use "../forms.scss";
</style>