<script lang="ts">
  import type { CommunityMessage, PublicUserSafe } from '$lib/types';
  import { composedMessage } from '$lib/components/Chat/stores';
  import Fa from 'svelte-fa';
  import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

  export let messages: CommunityMessage[];
  export let community: {
    //Which community does this chat belong to?
    id: number;
    name: string | null;
    description: string | null;
  };

  let disabled = false;
  let fallback = false;

  const send_message = async () => {
    const res = await fetch('/api/community/' + community.id + '/message', {
      method: 'POST',
      body: JSON.stringify({
        message: $composedMessage,
      }),
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityMessage;
  };
</script>

<button
  class="btn variant-filled-primary py-1 my-2 mx-2"
  on:click={() => {
    disabled = true;
    const res = send_message();
    if (fallback) {
      res.then((value) => {
        messages = [...messages, value];
        $composedMessage = '';
        disabled = false;
      });
    } else {
      res.then((value) => {
        $composedMessage = '';
        disabled = false;
      });
    }
  }}
  {disabled}
>
  <Fa size="xs" icon={faPaperPlane} />&nbsp;Send</button
>
