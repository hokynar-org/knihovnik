<script lang="ts">
    import type { PageServerLoad } from './$types';

    export let data: PageServerLoad;
</script>
<h1>
    User (si vole hehehehe)
</h1>
<table>
    {#each data.user as usr}
    <tr>
        <td>
            {usr.fullName}
        </td>
        <td>
            {usr.phone}
        </td>
    </tr>
    {/each}
</table>