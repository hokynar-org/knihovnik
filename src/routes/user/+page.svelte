<script lang="ts">
    import type { PageServerLoad } from './$types';

    export let data: PageServerLoad;
    let user = data
</script>
<h1>
    User (si vole hehehehe)
</h1>
<div>
    {user?.user}
</div>