<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import ChatMessage from '$lib/components/Chat/ChatMessage.svelte';
  import ChatSendCommunity from './ChatSendCommunity.svelte';
  import type {
    CommunityMessage,
    PublicUserSafe,
    RequestActionMessage,
    Community,
    BorrowRequest,
  } from '$lib/types';
  import { composedMessage, enterPresses } from '$lib/components/Chat/stores';
  import ChatSendRequest from './ChatSendRequest.svelte';

  export let messages: CommunityMessage[] | RequestActionMessage[];
  export let user: PublicUserSafe; //To determine who writes "your" messages
  //export let isadmin: Boolean; //To be used to determine if you can delete messages
  export let community = null as null | Community; //Which community does this chat belong to?
  export let borrow_request = null as null | BorrowRequest; //Which borrow request does this chat belong to?
  export let fallback: boolean = true;
  function isCommunityMessages(
    messages: (CommunityMessage | RequestActionMessage)[],
  ): messages is CommunityMessage[] {
    //Only CommunityMessage contains the property community_id
    return messages.every((item) => 'community_id' in item);
  }
  function isCommunityNotNull(
    community: null | Community,
  ): community is Community {
    return !(community === null);
  }

  function isRequestMessages(
    messages: (CommunityMessage | RequestActionMessage)[],
  ): messages is RequestActionMessage[] {
    return messages.every((item) => 'borrow_request_id' in item);
  }
  function isBorrowRequestNotNull(
    borrow_request: null | BorrowRequest,
  ): borrow_request is BorrowRequest {
    return !(borrow_request === null);
  }

  let chatWindow: HTMLDivElement;
  onMount(() => scrollToBottom(chatWindow));

  const scrollToBottom = async (node: any) => {
    if (node === undefined) {
      return;
    }
    node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
  };

  function isNearToScroll(node: any): boolean | null {
    if (node === undefined) {
      return null;
    }

    const currentScrollDistance =
      node.scrollHeight - node.scrollTop - node.clientHeight;

    if (currentScrollDistance < 500) {
      //The chat window height is 500px
      //We scroll only if the distance is smaller than that.
      return true;
    } else {
      return false;
    }
  }

  function enterPressed(event: KeyboardEvent): void {
    //Registering Enter presses to send a message without pressing the button
    if (event.key === 'Enter' || event.code === 'Enter') {
      $enterPresses = $enterPresses + 1;
    }
  }

  let callback: (() => void) | null;
  $: messages,
    (callback = () => {
      if (isNearToScroll(chatWindow)) {
        scrollToBottom(chatWindow);
      }
    });
  afterUpdate(() => {
    if (!!callback) {
      callback();
      callback = null;
    }
  });
</script>

<div class="max-h-[500px] overflow-y-scroll pr-4 w-full" bind:this={chatWindow}>
  <table class="w-full">
    {#each messages as community_message (community_message.id)}
      <ChatMessage {user} {community_message} />
    {/each}
  </table>
</div>

{#if isCommunityMessages(messages) && isCommunityNotNull(community)}
  <div class="flex my-2 w-full">
    <input
      class="input"
      type="text"
      bind:value={$composedMessage}
      on:keydown={enterPressed}
    />
    <ChatSendCommunity {community} {messages} {fallback} />
  </div>
{:else if isRequestMessages(messages) && isBorrowRequestNotNull(borrow_request)}
  {#if borrow_request.status !== 'CONFIRMED' && borrow_request.status !== 'PENDING' && borrow_request.status !== 'ABORTED' && borrow_request.status !== 'DENIED'}
    <div class="flex my-2 w-full">
      <input
        class="input"
        type="text"
        bind:value={$composedMessage}
        on:keydown={enterPressed}
      />
      <ChatSendRequest {borrow_request} {fallback} />
    </div>
  {/if}
{/if}
