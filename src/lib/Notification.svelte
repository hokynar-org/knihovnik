<script lang="ts">
  import type { Notification } from '$lib/types';
  export let notification: Notification;
</script>

<div>
  <a href={notification?.url}>
    <p>
      {notification?.text}
    </p>
    {new Date(notification.timestamp).toLocaleString()}
  </a>
</div>
