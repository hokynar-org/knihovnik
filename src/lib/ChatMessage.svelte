<script lang="ts">
  import type { CommunityMessage, PublicUserSafe, User } from '$lib/types';

  export let community_message: CommunityMessage;
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

<tr on:mouseleave={mouseLeave} on:mouseover={mouseOver} on:focus={mouseOver}>
  <td class="text-right">
    {#if community_message.user_id != user.id}
      <div>
        <a href={'/user/' + user.id}>{community_message.user_name}</a>:
      </div>
    {/if}
  </td>
  <td class="py-2.5 grid">
    <div
      class="card px-3 py-1 variant-soft fit-content max-w-xs overflow-hidden wrap-anywhere"
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
    {/if}
  </td>
  <td>
    {#if community_message.user_id == user.id}
      <div>
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
