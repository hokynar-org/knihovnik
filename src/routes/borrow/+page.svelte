<script lang="ts">
  import BorrowableItem from "../../lib/BorrowableItem.svelte";
  import type { PageData, PageServerData } from "./$types";
  export let data: PageData;
  const user = data.user;
</script>

<div class="container">
  {#each data.offers as offer (offer.item.id)}
    <BorrowableItem {offer} user_id={user.id} />
  {/each}
</div>

<div class="results" />
