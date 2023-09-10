<script lang="ts">
  import { onMount } from 'svelte';
  import ChatMessage from '$lib/components/Chat/ChatMessage.svelte';
  import ChatSendCommunity from './ChatSendCommunity.svelte';
  import type {
    CommunityMessage,
    PublicUserSafe,
    RequestActionMessage,
    Community,
  } from '$lib/types';
  import { composedMessage } from '$lib/components/Chat/stores';

  export let messages: CommunityMessage[] | RequestActionMessage[];
  export let user: PublicUserSafe; //To determine who writes "your" messages
  //export let isadmin: Boolean; //To be used to determine if you can delete messages
  export let community = null as null | Community; //Which community does this chat belong to?

  function isCommunityMessages(
    messages: CommunityMessage[] | RequestActionMessage[],
  ): messages is CommunityMessage[] {
    //Only CommunityMessage contains the property community_id
    return messages.every((item) => 'community_id' in item);
  }
  function isCommunityNull(
    community: null | Community,
  ): community is Community {
    return community === null;
  }

  let element: HTMLDivElement;
  onMount(() => scrollToBottom(element));
  const scrollToBottom = async (node: any) => {
    node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
  };
</script>

<div class="max-h-[500px] overflow-y-scroll pr-4 w-full" bind:this={element}>
  <table class="w-full">
    {#each messages as community_message (community_message.id)}
      <ChatMessage {user} {community_message} />
    {/each}
  </table>
</div>
<div class="flex my-2 w-full">
  <input class="input" type="text" bind:value={$composedMessage} />
  {#if isCommunityMessages(messages) && isCommunityNull(community)}
    <ChatSendCommunity {community} {messages} />
  {/if}
</div>
