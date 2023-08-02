<script lang="ts">
  import BorrowableItem from '$lib/BorrowableItem.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<BorrowableItem offer={data.offer} user_id={data.user.id} />
