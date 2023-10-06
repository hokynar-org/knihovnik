<script lang="ts">
  import Item from '$lib/components/ItemDisplay/Item.svelte';
  import Chat from '$lib/components/Chat/Chat.svelte';
  import Fa from 'svelte-fa';
  import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
  import { pusher } from '$lib/store.js';
  import type { CommunityMessage } from '$lib/types';
  import { onDestroy } from 'svelte';

  export let data;
  $: user = data.user;
  $: community = data.community;
  $: community_users = data.community_users;
  $: community_messages = data.community_messages;
  $: community_items = data.community_items;

  let fallback = false;
  if ($pusher) {
    const channel = $pusher.subscribe(
      'private-community-' + String(data.community.id),
    );
    channel.bind('message', (data: { message: CommunityMessage }) => {
      community_messages = [...community_messages, data.message];
    });
    onDestroy(() => {
      channel.unsubscribe();
    });
  } else {
    fallback = true;
  }
</script>

<div class="mt-6">
  <h3 class="mb-2 text-2xl">Users in this community</h3>
  {#each community_users as community_user}
    <a href={'/user/' + community_user.user.id}
      >{community_user.user.user_name}</a
    >
    ({community_user.relation.role})
    <br />
  {/each}
</div>

<div class="mt-6 border-solid border-2 pl-4 w-modal">
  <div
    class="inline-grid items-baseline grid-cols-2"
    title="This chat is not encrypted. Do not share any sensitive information: use
    end-to-end encrypted services like Signal for that."
  >
    <h3 class="mt-4 mb-2 text-xl">Community chat</h3>
    <p class="ml-2">
      <Fa class="inline text-xl" icon={faLockOpen} />
    </p>
  </div>
  <Chat messages={community_messages} {user} {community} />
</div>

<div>
  <h3 class="mt-4 mb-2 text-xl">Community Items</h3>
  <div class="mt-6 w-full">
    {#each community_items as offer (offer.item.id)}
      <Item item={offer.item} owner={offer.owner} holder={null}></Item>
    {/each}
  </div>
</div>

<style>
</style>
