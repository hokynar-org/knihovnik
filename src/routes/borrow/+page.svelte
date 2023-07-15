<script lang="ts">
  import BorrowableItem from "../../lib/BorrowableItem.svelte";

  export let data;
</script>

<div class="container">
  {#each data.offers as offer (offer.item.id)}
    <BorrowableItem {offer} user_id={data.user.id} />
  {/each}
</div>

<div class="results" />
