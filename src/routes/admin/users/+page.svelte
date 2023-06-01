<script lang="ts">
    import type { PageServerData } from './$types';

    export let data: PageServerData;
</script>
<h1>
    Seznam uživatelů
</h1>
<table class="container">
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
<style>
.smol{
    margin:0;
    padding:0;
}
</style>