<script lang="ts">
  import type { BorrowRequest, NotificationBorrowRequest } from './types';
  import { onMount } from 'svelte';
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
  async function accept() {
    const response = await fetch(
      '/api/borrow_request/' + request.id + '/accept',
      {
        method: 'POST',
      },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return (await response.json()) as BorrowRequest;
  }
  async function deny() {
    const response = await fetch(
      '/api/borrow_request/' + request.id + '/deny',
      {
        method: 'POST',
      },
    );
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return (await response.json()) as BorrowRequest;
  }

  // async function cancel() {
  //   const response = await fetch(
  //     '/api/borrow_request/' + request.id + '/cancel',
  //     {
  //       method: 'POST',
  //     },
  //   );
  //   if (!response.ok) {
  //     throw new Error(String(response.status));
  //   }
  //   return (await response.json()) as BorrowRequest;
  // }
</script>

<div>
  <a href="/borrow_request/{request.id}">*</a>User {borrower.full_name} wants
  <a href="/item/{item.id}">{item.name}</a>
  {#if request.status == 'PENDING'}
    <button
      on:click={() => {
        disabled = true;
        status = accept()
          .then((value) => {
            request = value;
            disabled = false;
            return value;
          })
          .catch((reson) => {
            disabled = false;
            return request;
          });
      }}
      {disabled}>Accept</button
    >
    <button
      on:click={() => {
        disabled = true;
        status = deny()
          .then((value) => {
            request = value;
            disabled = false;
            return value;
          })
          .catch((reson) => {
            disabled = false;
            return request;
          });
      }}
      {disabled}>Deny</button
    >
  {/if}
  <!-- {#if request.status == 'ACCEPTED'}
    <button
      on:click={() => {
        status = cancel()
          .then((value) => {
            request = value;
            disabled = false;
            return value;
          })
          .catch((reson) => {
            disabled = false;
            return request;
          });
      }}
      {disabled}>Cancel</button
    >
  {/if} -->
  {request.status}
</div>
