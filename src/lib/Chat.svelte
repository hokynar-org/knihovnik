<script lang="ts">
  import { onMount } from 'svelte';
  import Fa from 'svelte-fa';
  import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
  import type {
    CommunityMessage,
    Community,
    PublicUserSafe,
    User,
    CommunityMessagePlus,
  } from '$lib/types';

  export let messages: CommunityMessagePlus[];
  export let user: PublicUserSafe; //To determine who writes "your" messages
  export let isadmin: Boolean; //To be used to determine if you can delete messages
  let community: {
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
    return (await res.json()) as CommunityMessagePlus;
  };
  let message = '';

  let timevisible = 0;
  function mouseOver(no: number) {
    timevisible = no;
  }
  function mouseLeave() {
    timevisible = 0;
  }
  let element: any;
  onMount(() => scrollToBottom(element));
  const scrollToBottom = async (node: any) => {
    node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
  };
</script>

<div class="max-h-[500px] overflow-y-scroll pr-4" bind:this={element}>
  <table>
    {#each messages as community_message (community_message.id)}
      <tr>
        <td
          class="text-right"
          on:mouseleave={mouseLeave}
          on:mouseover={() => mouseOver(community_message.id)}
          on:focus={() => mouseOver(community_message.id)}
        >
          {#if community_message.user_id != user.id}
            <div>
              <a href={'/user/' + user.id}>{community_message.user_name}</a>:
            </div>
            {#if timevisible == community_message.id}
              <!--
              <div class="text-sm">
                {community_message.timestamp
                  ? new Date(community_message.timestamp).toLocaleTimeString()
                  : ''}
                {community_message.timestamp
                  ? new Date(community_message.timestamp).toLocaleDateString()
                  : ''}
              </div>
              -->
            {/if}
          {/if}
        </td>
        <td class="py-2.5 flex">
          {#if community_message.user_id == user.id}
            <div
              class="card px-3 py-1 variant-soft fit-content max-w-xs max-h-[6.6rem] line-clamp overflow-hidden wrap-anywhere ml-auto"
            >
              {community_message.message}
            </div>
          {:else}
            <div
              class="card px-3 py-1 variant-soft fit-content max-w-xs max-h-[6.6rem] line-clamp overflow-hidden wrap-anywhere"
            >
              {community_message.message}
            </div>
          {/if}
        </td>
        <td
          on:mouseleave={mouseLeave}
          on:mouseover={() => mouseOver(community_message.id)}
          on:focus={() => mouseOver(community_message.id)}
        >
          {#if community_message.user_id == user.id}
            <div>
              :<a href={'/user/' + user.id}>{community_message.user_name}</a>
            </div>
            {#if timevisible == community_message.id}
              <!--
                <div class="text-sm">
                {community_message.timestamp
                  ? new Date(community_message.timestamp).toLocaleTimeString()
                  : ''}
                {community_message.timestamp
                  ? new Date(community_message.timestamp).toLocaleDateString()
                  : ''}
              </div>
              -->
            {/if}
          {/if}
        </td>
      </tr>
    {/each}
  </table>
</div>
<div class="flex my-2">
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
        });
      } else {
        res.then((value) => {
          message = '';
          disabled = false;
        });
      }
    }}
    {disabled}
  >
    <Fa size="xs" icon={faPaperPlane} />&nbsp;Send</button
  >
</div>

<style>
  .fit-content {
    width: fit-content;
  }

  .wrap-anywhere {
    overflow-wrap: anywhere;
  }
</style>
