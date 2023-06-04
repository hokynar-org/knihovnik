<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import BorrowItem from "../../lib/BorrowItem.svelte";
    import type { PageData, PageServerData } from "./$types";
    export let data:PageData;
    const user = data.user;
</script>

<div class="container">
{#each data.offers as offer (offer.item.id)}
    <BorrowItem offer={offer} user_id={user.id}/>
{/each}
</div>

<div class="results">
    
</div>
