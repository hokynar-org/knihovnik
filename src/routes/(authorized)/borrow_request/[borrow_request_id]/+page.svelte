<script lang="ts">
  import type { PageData } from './$types';
  import { request_actions } from '$lib/store';
  export let data: PageData;
  import PlainItem from '$lib/PlainItem.svelte';
  import { goto } from '$app/navigation';
  $: borrow_request = data.borrow_request;
  $: $request_actions = data.request_actions;
  $: lender = data.lender;
  $: borrower = data.borrower;
  $: owner = data.owner;
  $: item = data.item;
  $: user = data.user;
  let disabled = false;
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
        deny()
          .then((value) => {
            borrow_request = value;
            disabled = false;
            return value;
          })
          .catch((reason) => {
            disabled = false;
          });
      }}
      {disabled}>Deny</button
    >
    <button
      on:click={() => {
        disabled = true;
        accept()
          .then((value) => {
            borrow_request = value;
            disabled = false;
            return value;
          })
          .catch((reason) => {
            disabled = false;
          });
      }}
      {disabled}>Accept</button
    >
  {:else if borrow_request.borrower_id == user.id}
    <button
      on:click={() => {
        disabled = true;
        cancel()
          .then((value) => {
            borrow_request = value;
            disabled = false;
            return value;
          })
          .catch((reason) => {
            disabled = false;
          });
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
    send_message().then((value) => {
      $request_actions = [...$request_actions, value];
    });
  }}>Send</button
>
