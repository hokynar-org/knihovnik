<script lang="ts">
  import Chat from '$lib/components/Chat/Chat.svelte';
  import Fa from 'svelte-fa';
  import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
  import { pusher } from '$lib/store.js';
  import type { CommunityMessage } from '$lib/types';
  import { onDestroy } from 'svelte';
  export let data;

  $: user = data.user;
  $: community = data.community;
  $: community_messages = data.community_messages;

  let fallback = false;
  if ($pusher) {
    const channel = $pusher.subscribe(
      'private-community-' + String(data.community.id),
    );
    channel.bind('message', (data: { message: CommunityMessage }) => {
      community_messages = [...community_messages, data.message];
    });
    onDestroy(() => {
      channel.unsubscribe();
    });
  } else {
    fallback = true;
  }
</script>

<div class="mt-6 border-solid border-2 pl-4 w-modal">
  <div
    class="inline-grid items-baseline grid-cols-2"
    title="This chat is not encrypted. Do not share any sensitive information: use
    end-to-end encrypted services like Signal for that."
  >
    <h3 class="mt-4 mb-2 text-xl">Community chat</h3>
    <p class="ml-2">
      <Fa class="inline text-xl" icon={faLockOpen} />
    </p>
  </div>
  <Chat messages={community_messages} {user} {community} />
</div>
