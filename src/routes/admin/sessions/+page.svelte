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
    </tr>

    {/each}
</table>
</div>