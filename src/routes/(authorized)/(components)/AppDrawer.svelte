<script lang="ts">
  import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
  import { page } from '$app/stores';
  import Sidebar from './Sidebar.svelte';
  import type { PrivateUserSafe } from '$lib/types';
  export let user: PrivateUserSafe;
  import { notifications } from '$lib/store';
  import Notification from '$lib/Notification.svelte';
  import Fa from 'svelte-fa';
  import {
    faExclamationCircle,
    faSpinner,
    faTrash,
  } from '@fortawesome/free-solid-svg-icons';
  async function deleteNotification() {
    const response = await fetch('/api/notifications/delete', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
  }
  async function readNotification() {
    const response = await fetch('/api/notifications/read', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
  }
  const readCallback = () => {
    reading = true;
    readNotification()
      .then((value) => {
        $notifications = $notifications.flatMap((notification) => {
          notification.read = true;
          return notification;
        });
        reading = false;
      })
      .catch((reason) => {
        reading = false;
      });
  };
  const deleteCallback = () => {
    deleting = true;
    deleteNotification()
      .then((value) => {
        deleting = false;
        $notifications = [];
      })
      .catch((reason) => {
        deleting = false;
      });
  };
  let deleting = false;
  let reading = false;
</script>

<Drawer>
  {@const id = $drawerStore.id}
  {#if id === 'mobile-menu'}
    <Sidebar isAdmin={user.role === 'admin'} current={$page.url.pathname} />
  {:else if id === 'notifications'}
    <menu class="p-2">
      <div class="border-b-2 border-surface-300-600-token">
        <h2 class="h2 pb-2">Notifications</h2>
        {#if $notifications.filter((notification) => {
          return !notification.read;
        }).length > 0}
          <button class="btn-icon" on:click={readCallback} disabled={reading}>
            {#if reading}
              <Fa class="self-center" size="lg" icon={faSpinner} />
            {:else}
              <Fa class="self-center" size="lg" icon={faExclamationCircle} />
            {/if}
          </button>
        {/if}
        {#if $notifications.length > 0}
          <button
            class="btn-icon"
            on:click={deleteCallback}
            disabled={deleting}
          >
            {#if deleting}
              <Fa class="self-center" size="lg" icon={faSpinner} />
            {:else}
              <Fa class="self-center" size="lg" icon={faTrash} />
            {/if}
          </button>
        {/if}
      </div>
      <ol>
        {#each $notifications as notification (notification.id)}
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
