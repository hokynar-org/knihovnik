<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
  console.log(data);
</script>

<!-- {data.borrow_request.status} -->
{#each data.request_actions as request_action}
  {request_action.type}
{/each}
