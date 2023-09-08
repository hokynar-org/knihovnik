<script lang="ts">
  import type { PageData } from './$types';
  import { request_actions, pusher } from '$lib/store';
  export let data: PageData;
  import Item from '$lib/Item.svelte';
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
  async function confirm() {
    const response = await fetch(
      '/api/borrow_request/' + borrow_request.id + '/confirm',
      {
        method: 'POST',
      },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return await response.json();
  }
  async function abort() {
    const response = await fetch(
      '/api/borrow_request/' + borrow_request.id + '/abort',
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

<h1 class="mt-6 mb-4 text-3xl min-w-xs">
  Borrow request for <a href={'/item/' + item.id}>{item.name}</a>
</h1>

<p>Status: {borrow_request.status}</p>
<p>
  This is a request between you and <a href={'/user/' + lender.id}
    >{lender.user_name}</a
  >.
</p>

{#if borrow_request.status == 'PENDING'}
  {#if borrow_request.lender_id == user.id}
    <h3 class="text-xl mt-4 mb-1">Accept the request?</h3>
    <p class="text-sm mb-2 max-w-xs">
      By accepting, you promise to borrow the item to the user
      <a href={'/user/' + lender.id}>{lender.user_name}</a>. Make sure to speak
      to them to clarify the terms of this borrowing. You can always cancel
      this.
    </p>
    <div>
      <button
        class="btn variant-filled-primary py-1 my-2"
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
      <button
        class="btn variant-filled-error py-1 my-2"
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
    </div>
  {:else if borrow_request.borrower_id == user.id}
    <h3 class="text-xl mt-4 mb-2">Cancel the request?</h3>
    <button
      class="btn variant-filled-error py-1 my-2"
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
{#if borrow_request.status == 'ACCEPTED' && $request_actions.filter((value) => {
    if (value.type == 'CONFIRM' && value.user_id == user.id) {
      return true;
    }
  }).length == 0}
  <h3 class="text-xl mt-4 mb-1">Confirm handover</h3>
  {#if borrow_request.lender_id == user.id}
    <p class="text-sm mb-2 max-w-xs">
      Confirm if you have given the item to
      <a href={'/user/' + lender.id}>{lender.user_name}</a>. Abort if you
      haven't and want to cancel this borrowing.
    </p>
  {:else}
    <p class="text-sm mb-2 max-w-xs">
      Confirm if you have received the item from
      <a href={'/user/' + owner.id}>{owner.user_name}</a>. Abort if you haven't
      and want to cancel this borrowing.
    </p>
  {/if}
  <div>
    <button
      class="btn variant-filled-primary py-1 my-2"
      on:click={() => {
        disabled = true;
        const res = confirm();
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
      {disabled}>Confirm</button
    >
    <button
      class="btn variant-filled-error py-1 my-2"
      on:click={() => {
        disabled = true;
        const res = abort();
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
      {disabled}>Abort</button
    >
  </div>
{/if}

<!--Chat-->
<div class="mt-6">
  <table>
    {#each $request_actions as request_action (request_action.id)}
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
  <div class="flex">
    <input class="input" type="text" bind:value={message} />
    <button
      class="btn variant-filled-primary py-1 my-2"
      on:click={() => {
        disabled = true;
        const res = send_message();
        if (fallback) {
          res.then((value) => {
            $request_actions = [...$request_actions, value];
            message = '';
            disabled = false;
          });
        } else {
          res.then((value) => {
            message = '';
            disabled = false;
          });
        }
      }}
      {disabled}>Send</button
    >
  </div>
</div>

<div class="mt-6">
  <Item {item} holder={null} owner={null} />
</div>
