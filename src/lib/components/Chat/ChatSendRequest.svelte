<script lang="ts">
  import type { RequestActionMessage, BorrowRequest } from '$lib/types';
  import { composedMessage } from '$lib/components/Chat/stores';
  import { request_actions } from '$lib/store';
  import Fa from 'svelte-fa';
  import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

  //export let messages: RequestActionMessage[];
  export let borrow_request: BorrowRequest;

  let disabled = false;
  let fallback = false;

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
</script>

<button
  class="btn variant-filled-primary py-1 my-2 mx-2"
  on:click={() => {
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
  }}
  {disabled}
>
  <Fa size="xs" icon={faPaperPlane} />&nbsp;Send</button
>
