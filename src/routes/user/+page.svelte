<script lang="ts">
    import type { PageData } from './$types.d.ts';
    import { superForm } from 'sveltekit-superforms/client';
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
    import {page} from '$app/stores';
    export let data: PageData;
    
    const form = superForm(data.form).form;
    const form_password = superForm(data.form_password).form;

    $form.user_name=$page.data.user.user_name;
    $form.full_name=$page.data.user.full_name;
    $form.pronouns=$page.data.user.pronouns;
  </script>
  
  <!-- <SuperDebug data={$form} />

  <SuperDebug data={$form_password} /> -->

<div class="container">
  <h4>
    Change info for user {$page.data.user.email}
  </h4> 
<div class="grid">
  <div>
    <form method="POST" action="?/update">
      <label for="user_name">Username</label>
      <input type="text" name="user_name" bind:value={$form.user_name} />
    
      <label for="full_name">Name</label>
      <input type="text" name="full_name" bind:value={$form.full_name} />
    
      <label for="pronouns">Prefered pronouns</label>
      <input type="text" name="pronouns" bind:value={$form.pronouns}/>
    
      <div>
        <button>Save changes</button>
      </div>
    </form>
  </div>
  <div>
    <form method="POST" action="?/update_password">
      <label for="old_password">Old Password</label>
      <input type="password" name="old_password" bind:value={$form_password.new_password} />
    
      <label for="new_password">New Password</label>
      <input type="password" name="new_password" bind:value={$form_password.old_password} />
    
      <div>
        <button>Update password</button>
      </div>
    </form>
  </div>
</div>
</div>
  