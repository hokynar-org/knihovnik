<script lang="ts">
  import type { PageData } from './$types';
  import { request_actions } from '$lib/store';
  export let data: PageData;
  $: borrow_request = data.borrow_request;
  $: $request_actions = data.request_actions;
  let message: string = '';
  async function send_message() {
    const response = await fetch(
      '/api/borrow_request/' + borrow_request.id + '/message',
      {
        method: 'POST',
        body: JSON.stringify({ message: message }),
      },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return await response.json();
  }
</script>

<!-- {data.borrow_request.status} -->
<table>
  {#each $request_actions as request_action}
    <tr>
      <td>
        {request_action.type}
      </td>
      <td>
        {request_action.user_id}
      </td>
      <td>
        {request_action.timestamp
          ? new Date(request_action.timestamp).toLocaleString()
          : ''}
      </td>
      <td>
        {request_action.message}
      </td>
    </tr>
  {/each}
</table>
<input style={'color:black'} type="text" bind:value={message} />
<button
  on:click={() => {
    send_message().then((value) => {
        $request_actions=[...$request_actions, value]    
    });
  }}>Send</button
>
