<script lang="ts">
  import { on } from 'ws';
  import type { BorrowRequest, NotificationBorrowRequest } from './types';
  import { onMount } from 'svelte';
  import { error } from '@sveltejs/kit';
  export let notification: NotificationBorrowRequest;
  $: item = notification.item;
  $: borrower = notification.borrower;
  $: request = notification.request;
  let status = Promise.resolve(request);
  let mounted = false;
  onMount(() => {
    mounted = true;
  });

  async function cancel() {
    const response = await fetch(
      '/api/borrow_request/' + request.id + '/cancel',
      {
        method: 'POST',
      },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return (await response.json()) as BorrowRequest;
  }
</script>

<div>
  User {borrower.full_name} wants {item.name}
  <button
    on:click={() => {
      status = cancel().then((value) => {
        request = value;
        return value;
      });
    }}>Cancel</button
  >
  {request.status}
</div>
