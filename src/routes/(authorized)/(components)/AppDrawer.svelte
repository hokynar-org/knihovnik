<script lang="ts">
  import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
  import { page } from '$app/stores';
  import Sidebar from './Sidebar.svelte';
  import type { PrivateUserSafe } from '$lib/types';
  export let user: PrivateUserSafe;
  import { notifications, groupNotificatons } from '$lib/store';
  import GroupNotification from '$lib/GroupNotification.svelte';
  import Fa from 'svelte-fa';
  import {
    faArrowRightToBracket,
    faExclamationCircle,
    faSpinner,
    faTrash,
  } from '@fortawesome/free-solid-svg-icons';
  async function deleteNotification() {
    const response = await fetch('/api/notifications/delete', {
      method: 'POST',
      body: JSON.stringify({
        ids: $notifications.map((value) => {
          return value.id;
        }),
      }),
    });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
  }
  async function readNotification() {
    const response = await fetch('/api/notifications/read', {
      method: 'POST',
      body: JSON.stringify({
        ids: $notifications.map((value) => {
          return value.id;
        }),
      }),
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
        <div class="flex justify-between">
          <h2 class="h2 pb-2">Notifications</h2>
          <button
            class="btn-icon"
            on:click={() => {
              drawerStore.close();
            }}
          >
            <Fa scale={'2x'} icon={faArrowRightToBracket} />
          </button>
        </div>
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
        {#each $groupNotificatons as gNotification (gNotification.ids[0])}
          <li>
            <GroupNotification groupNotification={gNotification} />
          </li>
        {/each}
      </ol>
    </menu>
  {:else}
    ?
  {/if}
</Drawer>
