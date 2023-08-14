<script lang="ts">
  import type { PageData } from './$types';
  import { request_actions, pusher } from '$lib/store';
  export let data: PageData;
  import PlainItem from '$lib/PlainItem.svelte';
  import { goto } from '$app/navigation';
  import type { BorrowRequest, RequestAction } from '$lib/types';
  import { onDestroy, onMount } from 'svelte';
  $: borrow_request = data.borrow_request;
  $: $request_actions = data.request_actions;
  $: lender = data.lender;
  $: borrower = data.borrower;
  $: owner = data.owner;
  $: item = data.item;
  $: user = data.user;
  let disabled = false;
  let message: string = '';
  let fallback = false;
  if ($pusher) {
    const channel = $pusher.subscribe(
      'private-borrow_request-' + String(data.borrow_request.id),
    );
    channel.bind(
      'request_action',
      (data: { borrow_request: BorrowRequest; action: RequestAction }) => {
        $request_actions = [...$request_actions, data.action];
        if (data.borrow_request) {
          borrow_request = data.borrow_request;
        }
      },
    );
    onDestroy(() => {
      channel.unsubscribe();
    });
  } else {
    fallback = true;
  }

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
  async function cancel() {
    const response = await fetch(
      '/api/borrow_request/' + borrow_request.id + '/cancel',
      {
        method: 'POST',
      },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return await response.json();
  }
  async function accept() {
    const response = await fetch(
      '/api/borrow_request/' + borrow_request.id + '/accept',
      {
        method: 'POST',
      },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return await response.json();
  }
  async function deny() {
    const response = await fetch(
      '/api/borrow_request/' + borrow_request.id + '/deny',
      {
        method: 'POST',
      },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return await response.json();
  }
  const id_to_user = (id: number) => {
    switch (id) {
      case lender.id:
        return lender.user_name;
      case borrower.id:
        return borrower.user_name;
      case owner.id:
        return owner.user_name;
    }
  };
</script>

{#if borrow_request.status == 'PENDING'}
  {#if borrow_request.lender_id == user.id}
    <button
      on:click={() => {
        disabled = true;
        const res = deny();
        if (fallback) {
          res
            .then((value) => {
              borrow_request = value;
              disabled = false;
              return value;
            })
            .catch((reason) => {
              disabled = false;
            });
        } else {
          res
            .then((value) => {
              disabled = false;
              return value;
            })
            .catch((reason) => {
              disabled = false;
            });
        }
      }}
      {disabled}>Deny</button
    >
    <button
      on:click={() => {
        disabled = true;
        const res = accept();
        if (fallback) {
          res
            .then((value) => {
              borrow_request = value;
              disabled = false;
              return value;
            })
            .catch((reason) => {
              disabled = false;
            });
        } else {
          res
            .then((value) => {
              disabled = false;
              return value;
            })
            .catch((reason) => {
              disabled = false;
            });
        }
      }}
      {disabled}>Accept</button
    >
  {:else if borrow_request.borrower_id == user.id}
    <button
      on:click={() => {
        disabled = true;
        const res = cancel();
        if (fallback) {
          res
            .then((value) => {
              borrow_request = value;
              disabled = false;
              return value;
            })
            .catch((reason) => {
              disabled = false;
            });
        } else {
          res
            .then((value) => {
              disabled = false;
              return value;
            })
            .catch((reason) => {
              disabled = false;
            });
        }
      }}
      {disabled}>Cancel</button
    >
  {/if}
{/if}

<div>
  <PlainItem {item} />
</div>
{borrow_request.status}
<table>
  {#each $request_actions as request_action}
    <tr>
      <td>
        {request_action.type}
      </td>
      <td>
        {id_to_user(request_action.user_id)}
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
    disabled = true;
    const res = send_message();
    if (fallback) {
      res.then((value) => {
        $request_actions = [...$request_actions, value];
        disabled = false;
      });
    } else {
      res.then((value) => {
        disabled = false;
      });
    }
  }}
  {disabled}>Send</button
>
