<script lang="ts">
    import type { PageServerData } from './$types';

    export let data: PageServerData;
</script>
<div class="container">
<h1>
    Seznam uživatelů
</h1>
<table role="grid">
    <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">User Name</th>
          <th scope="col">Email</th>
          <th scope="col">Full Name</th>
          <th scope="col">Pronouns</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>
    
    {#each data.users as usr (usr.id)}
    <tr>
        <td>
            {usr.id}
        </td>
        <td>
            {usr.user_name}
        </td>
        <td>
            {usr.email}
        </td>
        <td>
            {usr.full_name}
        </td>
        <td>
            {usr.pronouns}
        </td>
        <td>
            {usr.role}
        </td>
        <td>
        <form class="smol" action="?/delete_user&id={usr.id}" method="POST">
            <button type="submit" class="smol outline secondary">X</button>
        </form>
        </td>
    </tr>

    {/each}
</table>
</div>
<style>
.smol{
    width: 2rem;
    margin:0;
    padding:0;
}
</style>