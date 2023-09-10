<script lang="ts">
  import type {
    CommunityMessage,
    PublicUserSafe,
    RequestActionMessage,
  } from '$lib/types';

  export let community_message: CommunityMessage | RequestActionMessage;
  export let user: PublicUserSafe; //To determine who writes "your" messages

  //Show time of message on hover, currently hidden
  //styling needs to be improved
  let timevisible = false;
  function mouseOver() {
    timevisible = true;
  }
  function mouseLeave() {
    timevisible = false;
  }

  let clamped = true;
  function toggleClamp() {
    clamped = !clamped;
  }
</script>

<tr
  on:mouseleave={mouseLeave}
  on:mouseover={mouseOver}
  on:focus={mouseOver}
  class="w-full relative"
>
  <td class="text-right align-top w-1/12 py-1.5">
    {#if community_message.user_id != user.id}
      <div class="">
        <a href={'/user/' + user.id}>{community_message.user_name}</a>:
      </div>
    {/if}
  </td>
  <td class="py-0.5 grid">
    {#if !('type' in community_message) || community_message.type == 'MESSAGE'}
      <div
        class="card px-3 py-1 variant-soft fit-content overflow-hidden wrap-anywhere"
        class:ml-auto={community_message.user_id == user.id}
        class:line-clamp={clamped}
        class:max-h-[6.6rem]={clamped}
        on:click={toggleClamp}
        on:keypress={toggleClamp}
        role="button"
        tabindex="0"
      >
        {community_message.message}
      </div>
    {:else}
      <div
        class="px-3 py-1 fit-content overflow-hidden wrap-anywhere"
        class:ml-auto={community_message.user_id == user.id}
        class:line-clamp={clamped}
        class:max-h-[6.6rem]={clamped}
        on:click={toggleClamp}
        on:keypress={toggleClamp}
        role="button"
        tabindex="0"
      >
        {community_message.type}
      </div>
    {/if}
    {#if timevisible}
      <br />
      <div
        class="text-sm px-3"
        class:ml-auto={community_message.user_id == user.id}
      >
        {community_message.timestamp
          ? new Date(community_message.timestamp).toLocaleTimeString()
          : ''}
        {community_message.timestamp
          ? new Date(community_message.timestamp).toLocaleDateString()
          : ''}
      </div>
    {:else}
      <br />
      <div
        class="text-sm px-3"
        class:ml-auto={community_message.user_id == user.id}
      >
        <br />
      </div>
    {/if}
  </td>
  <td class="text-right align-top w-1/12 py-1.5">
    {#if community_message.user_id == user.id}
      <div class="">
        :<a href={'/user/' + user.id}>{community_message.user_name}</a>
      </div>
    {/if}
  </td>
</tr>

<style>
  .fit-content {
    width: fit-content;
  }

  .wrap-anywhere {
    overflow-wrap: anywhere;
  }
</style>
