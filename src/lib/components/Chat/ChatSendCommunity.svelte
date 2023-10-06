<script lang="ts">
  import type { CommunityMessage, Community } from '$lib/types';
  import { composedMessage, enterPresses } from '$lib/components/Chat/stores';
  import Fa from 'svelte-fa';
  import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

  export let messages: CommunityMessage[];
  export let community: Community; //Which community does this chat belong to?

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

  function button_click() {
    if ($composedMessage === '') {
      return;
    }
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
  }

  $: $enterPresses > 0 && button_click(); //Trigger when store is updated, but don't trigger with 0 keypresses
</script>

<button
  class="btn variant-filled-primary py-1 my-2 mx-2"
  on:click={button_click}
  {disabled}
>
  <Fa size="xs" icon={faPaperPlane} />&nbsp;Send</button
>
