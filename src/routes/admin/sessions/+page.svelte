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
          <th scope="col">Auth Token</th>
          <th scope="col">User ID</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>
    
    {#each data.sessions as session (session.auth_token)}
    <tr>
        <td>
            {session.auth_token}
        </td>
        <td>
            {session.user_id}
        </td>
        <td>
            <form class="smol" action="?/delete_session&auth_token={session.auth_token}" method="POST">
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