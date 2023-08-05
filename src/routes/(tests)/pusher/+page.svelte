<script lang="ts">
  import Pusher from 'pusher-js';
  const APP_KEY = '1647023';
  const APP_CLUSTER = 'eu';
  const pusher = new Pusher(APP_KEY, {
    cluster: APP_CLUSTER,
  });
  console.log(pusher);
  const ch = pusher.connect();
  //   console.log(ch);
</script>
