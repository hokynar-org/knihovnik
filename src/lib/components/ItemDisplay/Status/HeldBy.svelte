<script lang="ts">
  import Fa from 'svelte-fa';
  import { faCube } from '@fortawesome/free-solid-svg-icons';
  import type { PublicUserSafe } from '$lib/types';
  export let holder: PublicUserSafe | null;
  import { page } from '$app/stores';
  $: user = $page.data.user as PublicUserSafe;
</script>

{#if holder}
  <div class="flex items-center">
    <p><Fa icon={faCube} /></p>
    <p class="pl-2">
      {#if holder.id == user.id}
        You hold this item
      {:else}
        <a href={'/user/' + holder.id}>{holder.user_name}</a> holds this item
      {/if}
    </p>
  </div>
{/if}
