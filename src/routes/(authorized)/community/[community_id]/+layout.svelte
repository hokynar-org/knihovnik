<script lang="ts">
  import type { CommunityRelation } from '$lib/types';
  import { navigating, page } from '$app/stores';
  export let data;
  console.log($page.route.id);
  $: community = data.community;
  $: community_users = data.community_users;
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
  const leave = async () => {
    const res = await fetch('/api/community/' + community.id + '/leave', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityRelation;
  };

  let isAdminTab = false;
  $: isAdminTab = String($page.url).includes('admin');
  $: console.log(isAdminTab);
</script>

<h4 class="mb-2">Community: {community.name}</h4>
<p>
  {community.description}
</p>

<div>
  {#if role}
    Your role is {role}
    {#if role == 'MEMBER' || role == 'ADMIN'}
      <button
        {disabled}
        class="btn variant-filled-error py-1 my-2"
        on:click={() => {
          disabled = true;
          leave()
            .then((value) => {
              disabled = false;

              role = null;
            })
            .catch((reason) => {
              disabled = false;
            });
        }}
      >
        Leave
      </button>
    {:else if role == 'INVITED'}
      <button
        class="btn variant-filled-primary py-1 my-2"
        {disabled}
        on:click={() => {
          disabled = true;
          confirm()
            .then((value) => {
              community_users = community_users.flatMap((fvalue) => {
                if (value.user_id != fvalue.user.id) {
                  return fvalue;
                } else {
                  return { relation: value, user: fvalue.user };
                }
              });
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
              community_users = community_users.filter((fvalue) => {
                value.user_id != fvalue.user.id;
              });
              role = null;
              disabled == false;
            })
            .catch((reason) => {
              disabled = false;
            });
        }}
      >
        Reject
      </button>
    {/if}
  {:else}
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
  {/if}

  <div class="mt-4">
    {#if role && role == 'ADMIN'}
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
          {#if $page.route.id == '/(authorized)/community/[community_id]/admin'}
            Admin dashboard
          {:else}
            <a class="text-base" href={'/community/' + community.id + '/admin'}
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
      </ol>
    {/if}
  </div>
</div>
<slot />
