<script lang="ts">
  import type { PageData } from './$types';
  import { request_actions, pusher } from '$lib/store';
  export let data: PageData;
  import Item from '$lib/Item.svelte';
  import Chat from '$lib/components/Chat/Chat.svelte';
  import type {
    BorrowRequest,
    RequestAction,
    RequestActionMessage,
  } from '$lib/types';
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
      (data: {
        borrow_request: BorrowRequest | undefined;
        action: RequestActionMessage;
      }) => {
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
    return (await response.json()) as {
      borrow_request: BorrowRequest | undefined;
      action: RequestActionMessage;
    };
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
    return (await response.json()) as {
      borrow_request: BorrowRequest | undefined;
      action: RequestActionMessage;
    };
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
    return (await response.json()) as {
      borrow_request: BorrowRequest | undefined;
      action: RequestActionMessage;
    };
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
    return (await response.json()) as {
      borrow_request: BorrowRequest | undefined;
      action: RequestActionMessage;
    };
  }
</script>

<h1 class="mt-6 mb-4 text-3xl min-w-xs">
  Borrow request for <a href={'/item/' + item.id}>{item.name}</a>
</h1>

<p>Status: {borrow_request.status}</p>
<p>
  This is a request between you and
  {#if user.id == lender.id}
    <a href={'/user/' + borrower.id}>{borrower.user_name}</a>.
  {:else if user.id == borrower.id}
    <a href={'/user/' + lender.id}>{lender.user_name}</a>.
  {/if}
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
                if (value.borrow_request) borrow_request = value.borrow_request;
                $request_actions = [...$request_actions, value.action];
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
                if (value.borrow_request) borrow_request = value.borrow_request;
                $request_actions = [...$request_actions, value.action];
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
      <a href={'/user/' + borrower.id}>{borrower.user_name}</a>. Abort if you
      haven't and want to cancel this borrowing.
    </p>
  {:else}
    <p class="text-sm mb-2 max-w-xs">
      Confirm if you have received the item from
      <a href={'/user/' + lender.id}>{lender.user_name}</a>. Abort if you
      haven't and want to cancel this borrowing.
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
              if (value.borrow_request) borrow_request = value.borrow_request;
              $request_actions = [...$request_actions, value.action];
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
              if (value.borrow_request) borrow_request = value.borrow_request;
              $request_actions = [...$request_actions, value.action];
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

<div class="mt-6 border-solid border-2 pl-4 w-modal">
  <Chat messages={$request_actions} {user} {borrow_request} />
</div>

<div class="mt-6">
  <Item {item} holder={null} owner={null} />
</div>
