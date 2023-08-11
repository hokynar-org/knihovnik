<script lang="ts">
  import type { Notification } from '$lib/types';
  import {
    faExclamationCircle,
    faCheck,
    faTrash,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  export let notification: Notification;
</script>

<div
  class="block border-b-2 border-surface-300-600-token hover:!border-surface-300-600-token hover:!bg-surface-300-600-token"
>
  <a href={notification?.url}>
    <div class="px-1">
      {notification?.text}
    </div>
    <div class="flex flex-nowrap p-1 m-t-2 justify-between">
      <div>{new Date(notification.timestamp).toLocaleString()}</div>
      {#if !notification.read}
        <Fa class="self-center" icon={faExclamationCircle} />
      {/if}
    </div>
  </a>
</div>
