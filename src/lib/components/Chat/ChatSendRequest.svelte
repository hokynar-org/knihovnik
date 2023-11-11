<script lang="ts">
  import type { RequestActionMessage, BorrowRequest } from '$lib/types';
  import { composedMessage, enterPresses } from '$lib/components/Chat/stores';
  import { request_actions } from '$lib/store';
  import Fa from 'svelte-fa';
  import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

  //export let messages: RequestActionMessage[];
  export let borrow_request: BorrowRequest;

  let disabled = false;
  export let fallback = true;

  async function send_message() {
    const response = await fetch(
      '/api/borrow_request/' + borrow_request.id + '/message',
      {
        method: 'POST',
        body: JSON.stringify({ message: $composedMessage }),
      },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return (await response.json()) as {
      borrow_request: BorrowRequest | undefined;
      action: RequestActionMessage;
    };
  }

  function button_click() {
    if ($composedMessage === '') {
      return;
    }
    disabled = true;
    const res = send_message();
    if (fallback) {
      res.then((value) => {
        if (value.borrow_request) borrow_request = value.borrow_request;
        $request_actions = [...$request_actions, value.action];
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
