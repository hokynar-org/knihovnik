<script lang="ts">
  import Fa from 'svelte-fa';
  import { faUser } from '@fortawesome/free-solid-svg-icons';
  import type { PublicUserSafe } from '$lib/types';
  export let owner: PublicUserSafe | null;
  import { page } from '$app/stores';
  $: user = $page.data.user as PublicUserSafe;
</script>

{#if owner}
  <div class="flex items-baseline">
    <p><Fa icon={faUser} /></p>
    <p class="pl-2">
      {#if owner.id == user.id}
        You own this item
      {:else}
        <a href={'/user/' + owner.id}>{owner.user_name}</a> owns this item
      {/if}
    </p>
  </div>
{/if}
