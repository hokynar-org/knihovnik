<script lang="ts">
  import { onMount } from 'svelte';
  import ChatMessage from '$lib/ChatMessage.svelte';
  import Fa from 'svelte-fa';
  import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
  import type { CommunityMessage, PublicUserSafe, User } from '$lib/types';

  export let messages: CommunityMessage[];
  export let user: PublicUserSafe; //To determine who writes "your" messages
  export let isadmin: Boolean; //To be used to determine if you can delete messages
  export let community: {
    //Which community does this chat belong to?
    id: number;
    name: string | null;
    description: string | null;
  };

  let disabled = false;
  let fallback = false;
  const send_message = async () => {
    const res = await fetch('/api/community/' + community.id + '/message', {
      method: 'POST',
      body: JSON.stringify({
        message: message,
      }),
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityMessage;
  };
  let message = '';

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
  <input class="input" type="text" bind:value={message} />
  <button
    class="btn variant-filled-primary py-1 my-2 mx-2"
    on:click={() => {
      disabled = true;
      const res = send_message();
      if (fallback) {
        res.then((value) => {
          messages = [...messages, value];
          message = '';
          disabled = false;
          scrollToBottom(element);
        });
      } else {
        res.then((value) => {
          message = '';
          disabled = false;
          scrollToBottom(element);
        });
      }
    }}
    {disabled}
  >
    <Fa size="xs" icon={faPaperPlane} />&nbsp;Send</button
  >
</div>
