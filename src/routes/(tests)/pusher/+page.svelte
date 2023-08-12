<script lang="ts">
  import Pusher from 'pusher-js';
  import { onMount } from 'svelte';
  export let data;
  const pusher = new Pusher(data.key, {
    cluster: data.cluster,
    userAuthentication: {
      endpoint: 'api/pusher/auth',
      transport: 'ajax',
    },
  });
  let jis = '';
  pusher.user.bind('event-name', () => {
    jis = 'fffffff';
  });
  pusher.signin();
</script>

{jis}
