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
          <th scope="col">id</th>
          <th scope="col">Jméno</th>
          <th scope="col">Kontakt</th>
          <th scope="col">Odstraň</th>
        </tr>
      </thead>
    
    {#each data.users as usr (usr.id)}
    <tr>
        <td>
            {usr.id}
        </td>
        <td>
            {usr.fullName}
        </td>
        <td>
            {usr.phone}
        </td>
        <td>
        <form class="smol" action="?/deleteUser&id={usr.id}" method="POST">
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