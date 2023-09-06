<script lang="ts">
  import Item from '$lib/Item.svelte';
  import BorrowItem from '$lib/BorrowItem.svelte';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  export let data: PageData;
  $: user = data.user;
  $: item = data.item;
  $: owner = data.owner;
  $: holder = data.holder;
  $: last_requst = data.last_requst ? data.last_requst.borrow_request : null;
  $: borrow_requests = data.borrow_requests;
  $: community_visibility = data.community_visibility;
  let disabled = false;
  const change_visibility = async (community_id: number) => {
    const res = await fetch(
      '/api/item/' + item.id + '/' + community_id + '/visibility',
      {
        method: 'POST',
      },
    );
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as {
      item_id: number | null;
      community_id: number | null;
    } | null;
  };
</script>

<div class="container">
  <Item {item} {holder} {owner}>
    {#if holder}
      {#if user.id != holder.id}
        <BorrowItem borrow_request={last_requst} {item} />
      {/if}
    {:else if user.id != owner.id}
      <BorrowItem borrow_request={last_requst} {item} />
    {/if}
  </Item>
</div>
{#if user.id == owner.id}
  <div>
    <h4>Nastavení</h4>
    <div>
      <ol>
        {#each community_visibility as visibility (visibility.communities.id)}
          <li>
            {visibility.communities.name}
            {#if visibility.item_visibility}
              True
            {:else}
              False
            {/if}
            <button
              class="btn variant-filled-primary py-1 my-2"
              on:click={() => {
                disabled = true;
                const res = change_visibility(visibility.communities.id);
                res.then((value) => {
                  const index = community_visibility.indexOf(visibility);
                  community_visibility[index].item_visibility = value;
                  disabled = false;
                });
              }}
              {disabled}>change</button
            >
          </li>
        {/each}
      </ol>
    </div>
  </div>
{/if}
<div>
  <h4>History</h4>
  <ol>
    {#each borrow_requests as borrow_request}
      <li>
        <a
          class="block p-4 hover:!bg-surface-300-600-token"
          href="/borrow_request/{borrow_request.borrow_request.id}"
        >
          {#if user.id == borrow_request.borrower.id}
            You requested {item.name} from user {borrow_request.lender
              .user_name}
          {:else if user.id == borrow_request.lender.id}
            User {borrow_request.borrower.user_name} requested {item.name} from you
          {:else}
            User {borrow_request.borrower.user_name} requested {item.name} from
            {borrow_request.lender.user_name}
          {/if}
          ({borrow_request.borrow_request.status})
        </a>
      </li>
    {/each}
  </ol>
</div>
