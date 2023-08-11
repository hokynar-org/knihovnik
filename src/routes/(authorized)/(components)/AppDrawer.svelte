<script lang="ts">
  import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
  import { page } from '$app/stores';
  import Sidebar from './Sidebar.svelte';
  import type { PrivateUserSafe } from '$lib/types';

  export let user: PrivateUserSafe;
  import { notifications } from '$lib/store';
  import Notification from '$lib/Notification.svelte';
</script>

<Drawer>
  {@const id = $drawerStore.id}
  {#if id === 'mobile-menu'}
    <Sidebar isAdmin={user.role === 'admin'} current={$page.url.pathname} />
  {:else if id === 'notifications'}
    <menu class="p-2">
      <h2 class="h2 pb-2 border-b-2 border-surface-300-600-token">
        Notifications
      </h2>
      <ol>
        {#each $notifications as notification}
          <li>
            <Notification {notification} />
          </li>
        {/each}
      </ol>
    </menu>
  {:else}
    ?
  {/if}
</Drawer>
