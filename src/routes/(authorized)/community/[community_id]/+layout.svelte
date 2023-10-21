<script lang="ts">
  import type { CommunityRelation } from '$lib/types';
  import Fa from 'svelte-fa';
  import { faClock } from '@fortawesome/free-solid-svg-icons';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  export let data;
  $: community = data.community;
  $: role = data.role;
  let disabled = false;
  const confirm = async () => {
    const res = await fetch('/api/community/' + community.id + '/confirm', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityRelation;
  };
  const reject = async () => {
    const res = await fetch('/api/community/' + community.id + '/reject', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityRelation;
  };
  const request = async () => {
    const res = await fetch('/api/community/' + community.id + '/request', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityRelation;
  };
</script>

<h4 class="mb-2">Community: {community.name}</h4>
{#if community.description}
  <p>
    {community.description}
  </p>
{/if}

<div class="mt-6">
  {#if role}
    {#if role == 'INVITED'}
      <div class="mb-6 w-fit mx-auto">
        <p>Someone invited you into this community. Join?</p>
        <div class="mx-auto w-fit">
          <button
            class="btn variant-filled-primary py-1 my-2"
            {disabled}
            on:click={() => {
              disabled = true;
              confirm()
                .then((value) => {
                  role = 'MEMBER';
                  disabled = false;
                })
                .catch((reason) => {
                  disabled = false;
                });
            }}
          >
            Confirm
          </button>
          <button
            class="btn variant-filled-error py-1 my-2"
            {disabled}
            on:click={() => {
              disabled = true;
              reject()
                .then((value) => {
                  role = null;
                  goto('/community');
                  disabled == false;
                })
                .catch((reason) => {
                  disabled = false;
                });
            }}
          >
            Reject
          </button>
        </div>
      </div>
    {:else if role == 'REQUESTED'}
      <div class="mb-6 w-fit mx-auto flex items-center">
        <p><Fa icon={faClock} /></p>
        <p class="pl-2">Requested to join</p>
      </div>
    {/if}
  {:else if community.visibility}
    <div class="mb-6 w-fit mx-auto">
      <button
        class="btn variant-filled-primary py-1 my-2"
        on:click={() => {
          request()
            .then((value) => {
              role = value.role;
            })
            .catch((reason) => {});
        }}
      >
        Request
      </button>
    </div>
  {/if}
</div>

{#if role && (role == 'MEMBER' || role == 'ADMIN')}
  <div>
    <div class="">
      <ol class="breadcrumb">
        <li class="text-lg">
          {#if $page.route.id == '/(authorized)/community/[community_id]'}
            Home
          {:else}
            <a class="text-base" href={'/community/' + community.id}>Home</a>
          {/if}
        </li>

        <li class="crumb-separator" aria-hidden>/</li>

        <li class="text-lg">
          {#if $page.route.id == '/(authorized)/community/[community_id]/items'}
            Items
          {:else}
            <a class="text-base" href={'/community/' + community.id + '/items'}
              >Items</a
            >
          {/if}
        </li>

        <li class="crumb-separator" aria-hidden>/</li>

        <li class="text-lg">
          {#if $page.route.id == '/(authorized)/community/[community_id]/chat'}
            Chat
          {:else}
            <a class="text-base" href={'/community/' + community.id + '/chat'}
              >Chat</a
            >
          {/if}
        </li>

        <li class="crumb-separator" aria-hidden>/</li>

        <li class="text-lg">
          {#if $page.route.id == '/(authorized)/community/[community_id]/users'}
            Users
          {:else}
            <a class="text-base" href={'/community/' + community.id + '/users'}
              >Users</a
            >
          {/if}
        </li>

        {#if role && role == 'ADMIN'}
          <li class="crumb-separator" aria-hidden>/</li>

          <li class="text-lg">
            {#if $page.route.id == '/(authorized)/community/[community_id]/admin'}
              Admin dashboard
            {:else}
              <a
                class="text-base"
                href={'/community/' + community.id + '/admin'}
                >Admin dashboard</a
              >
            {/if}
          </li>
          <li class="crumb-separator" aria-hidden>/</li>
          <li class="text-lg">
            {#if $page.route.id == '/(authorized)/community/[community_id]/admin/edit'}
              Settings
            {:else}
              <a
                class="text-base"
                href={'/community/' + community.id + '/admin/edit'}>Settings</a
              >
            {/if}
          </li>
        {/if}
      </ol>
    </div>
  </div>

  <slot />
{/if}
