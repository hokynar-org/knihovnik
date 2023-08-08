<script lang="ts">
  import type { BorrowRequest, NotificationBorrowRequest } from './types';
  import { onMount } from 'svelte';
  import { notifications_a } from '$lib/store';
  export let notification: NotificationBorrowRequest;

  $: item = notification.item;
  $: borrower = notification.user;
  $: request = notification.borrow_request;
  let status = Promise.resolve(request);
  let mounted = false;
  let disabled = false;
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
  <a href="/borrow_request/{request.id}">*</a>
  You requested <a href="/item/{item.id}">{item.name}</a> from {borrower.full_name}
  <button
    on:click={() => {
      disabled = true;
      cancel()
        .then((value) => {
          request = value;
          const index = $notifications_a.indexOf(notification);
          if (index > -1) {
            $notifications_a.splice(index, 1);
            $notifications_a = $notifications_a; // důležité pro Svelte
          }
          disabled = false;
        })
        .catch((reson) => {
          disabled = false;
        });
    }}
    {disabled}>Cancel</button
  >
  {request.status}
</div>
