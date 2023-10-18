<script lang="ts">
  import type { GroupNotificaton } from '$lib/types';
  import {
    faExclamationCircle,
    faCheck,
    faTrash,
    faSpinner,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  export let groupNotification: GroupNotificaton;
  import { notifications } from '$lib/store';
  let deleting = false;
  let reading = false;
  async function deleteNotification() {
    const response = await fetch('/api/notifications/delete', {
      method: 'POST',
      body: JSON.stringify({ ids: groupNotification.ids }),
    });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
  }
  async function readNotification() {
    const response = await fetch('/api/notifications/read', {
      method: 'POST',
      body: JSON.stringify({ ids: groupNotification.ids }),
    });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
  }
  const readCallback = () => {
    if (!groupNotification.read) {
      reading = true;
      readNotification()
        .then((value) => {
          const indexes = groupNotification.ids.map((value) => {
            const index = $notifications
              .map((value) => {
                return value.id;
              })
              .indexOf(value);
            return index;
          });
          indexes.forEach((index) => {
            if (index > -1) {
              $notifications[index].read = true;
              $notifications = $notifications; // důležité pro Svelte
            }
          });
          reading = false;
        })
        .catch((reason) => {
          reading = false;
        });
    }
  };
  const deleteCallback = () => {
    reading = true;
    deleteNotification()
      .then((value) => {
        const indexes = groupNotification.ids.map((value) => {
          const index = $notifications
            .map((value) => {
              return value.id;
            })
            .indexOf(value);
          return index;
        });
        groupNotification.ids.forEach((id) => {
          const index = $notifications
            .map((value) => {
              return value.id;
            })
            .indexOf(id);
          if (index > -1) {
            $notifications.splice(index, 1);
            $notifications = $notifications;
          }
        });
        reading = false;
      })
      .catch((reason) => {
        reading = false;
      });
  };
</script>

<!-- TODO accesibility -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<button class="btn-icon" on:click={deleteCallback} disabled={deleting}>
  {#if deleting}
    <Fa class="self-center" icon={faSpinner} />
  {:else}
    <Fa class="self-center" icon={faTrash} />
  {/if}
</button>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="block border-b-2 border-surface-300-600-token hover:!border-surface-300-600-token hover:!bg-surface-300-600-token"
  on:mouseover={readCallback}
  on:focus={readCallback}
>
  <a href={groupNotification?.url}>
    <div class="px-1">
      {groupNotification?.text}
      {groupNotification.ids.length > 1
        ? 'x' + groupNotification.ids.length
        : ''}
    </div>
    <div class="flex flex-nowrap p-1 m-t-2 justify-between">
      <div>{new Date(groupNotification.timestamp).toLocaleString()}</div>
      {#if !groupNotification.read}
        {#if reading}
          <Fa class="self-center" icon={faSpinner} />
        {:else}
          <Fa class="self-center" icon={faExclamationCircle} />
        {/if}
      {/if}
    </div>
  </a>
</div>
