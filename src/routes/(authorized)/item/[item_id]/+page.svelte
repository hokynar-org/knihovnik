<script lang="ts">
  import BorrowableItem from '$lib/BorrowableItem.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="container">
  <BorrowableItem offer={data.offer} user_id={data.user.id} />
</div>
