<script lang="ts">
  import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
  import { page } from '$app/stores';
  import Sidebar from './Sidebar.svelte';
  import type { PrivateUserSafe } from '$lib/types';

  export let user: PrivateUserSafe;
</script>

<Drawer>
  {@const id = $drawerStore.id}
  {#if id === 'mobile-menu'}
    <Sidebar isAdmin={user.role === 'admin'} current={$page.url.pathname} />
  {:else if id === 'alerts'}
    <menu class="p-2">
      <h2 class="h2">Alerts</h2>
      <ol></ol>
    </menu>
  {:else}
    ?
  {/if}
</Drawer>
