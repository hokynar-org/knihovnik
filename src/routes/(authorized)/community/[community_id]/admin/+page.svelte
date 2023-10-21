<script lang="ts">
  import CommunityUsers from '$lib/components/Community/CommunityUsers.svelte';
  import type {
    CommunityRelation,
    PublicUserSafe,
    CommunityUserSafe,
  } from '$lib/types';
  export let data;
  $: community = data.community;
  $: community_users = data.community_users;

  let found_users: PublicUserSafe[] = [];
  let search_name = '';
  const lengthDisabled = 1;
  let disabled = false;
  let searchedOnce = false;
  const search = async (user_name: string) => {
    const res = await fetch('/api/find_user/' + user_name, {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as PublicUserSafe[];
  };
  const invite = async (user_id: number) => {
    const res = await fetch(
      '/api/community/' + community.id + '/' + user_id + '/invite',
      {
        method: 'POST',
      },
    );
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityRelation;
  };
  function invite_pressed(user: PublicUserSafe): void {
    disabled = true;
    invite(user.id)
      .then((value) => {
        community_users = [...community_users, { relation: value, user: user }];
        disabled = false;
      })
      .catch((reason) => {
        disabled = false;
      });
  }

  const kick = async (user_id: number) => {
    const res = await fetch(
      '/api/community/' + community.id + '/' + user_id + '/kick',
      {
        method: 'POST',
      },
    );
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityRelation;
  };
  function kick_pressed(community_user: CommunityUserSafe): void {
    disabled = true;

    kick(community_user.user.id)
      .then((value) => {
        community_users = community_users.filter((fvalue) => {
          return value.user_id !== fvalue.user.id;
        });
        disabled = false;
      })
      .catch((reason) => {
        disabled = false;
      });
  }

  const promote = async (user_id: number) => {
    const res = await fetch(
      '/api/community/' + community.id + '/' + user_id + '/promote',
      {
        method: 'POST',
      },
    );
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityRelation;
  };
  function promote_pressed(community_user: CommunityUserSafe): void {
    disabled = true;

    promote(community_user.user.id)
      .then((value) => {
        community_users = community_users.flatMap((fvalue) => {
          if (value.user_id != fvalue.user.id) {
            return fvalue;
          } else {
            return { relation: value, user: fvalue.user };
          }
        });
        disabled = false;
      })
      .catch((reason) => {
        disabled = false;
      });
  }

  const accept = async (user_id: number) => {
    const res = await fetch(
      '/api/community/' + community.id + '/' + user_id + '/accept',
      {
        method: 'POST',
      },
    );
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityRelation;
  };
  function accept_pressed(community_user: CommunityUserSafe): void {
    disabled = true;
    accept(community_user.user.id)
      .then((value) => {
        community_users = community_users.flatMap((fvalue) => {
          if (value.user_id != fvalue.user.id) {
            return fvalue;
          } else {
            return { relation: value, user: fvalue.user };
          }
        });
        disabled = false;
      })
      .catch((reason) => {
        disabled = false;
      });
  }

  const deny = async (user_id: number) => {
    const res = await fetch(
      '/api/community/' + community.id + '/' + user_id + '/deny',
      {
        method: 'POST',
      },
    );
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as CommunityRelation;
  };
  function deny_pressed(community_user: CommunityUserSafe): void {
    disabled = true;
    deny(community_user.user.id)
      .then((value) => {
        community_users = community_users.filter((fvalue) => {
          return value.user_id != fvalue.user.id;
        });
        disabled = false;
      })
      .catch((reason) => {
        disabled = false;
      });
  }

  //Only use this if you know that the User is in the community
  function UsertoCommunityUser(
    community_users: CommunityUserSafe[],
    user: PublicUserSafe,
  ): CommunityUserSafe {
    let found: CommunityUserSafe;
    found = community_users.find(
      (community_user) => community_user.user.id === user.id,
    )!;
    return found;
  }

  //Find and invite users: enter to press
  function button_clicked_faiu() {
    disabled = true;
    search(search_name)
      .then((value) => {
        disabled = false;
        found_users = value;
        searchedOnce = true;
      })
      .catch((reason) => {
        disabled = false;
        searchedOnce = true;
        found_users = [];
      });
  }

  function enterPressed_faiu(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.code === 'Enter') {
      if (search_name.length > lengthDisabled) {
        button_clicked_faiu();
      }
    }
  }
</script>

<div class="mt-6">
  <h3 class="mb-2 text-xl">Users in this community</h3>
  {#each community_users as community_user}
    <a href={'/user/' + community_user.user.id}
      >{community_user.user.user_name}</a
    >
    ({community_user.relation.role})
    {#if community_user.relation.role == 'MEMBER'}
      <button
        {disabled}
        class="btn variant-filled-error py-1 my-2"
        on:click={() => kick_pressed(community_user)}
      >
        Kick
      </button>
      <button
        class="btn variant-filled-primary py-1 my-2"
        {disabled}
        on:click={() => promote_pressed(community_user)}
      >
        Promote
      </button>
    {:else if community_user.relation.role == 'REQUESTED'}
      <button
        {disabled}
        class="btn variant-filled-error py-1 my-2"
        on:click={() => deny_pressed(community_user)}
      >
        Deny
      </button>
      <button
        class="btn variant-filled-primary py-1 my-2"
        {disabled}
        on:click={() => accept_pressed(community_user)}
      >
        Accept
      </button>
    {/if}
    <br />
  {/each}
</div>

<h3 class="mt-6 mb-2 text-xl">Find and invite users</h3>
<div>
  <input
    class="input"
    type="text"
    bind:value={search_name}
    on:keydown={enterPressed_faiu}
  />
  <div class="flex content-center justify-center my-3">
    <button
      disabled={search_name.length < lengthDisabled || disabled}
      class="btn variant-filled-primary py-1"
      on:click={button_clicked_faiu}
    >
      Search
    </button>
  </div>
  {#if searchedOnce}
    <h3 class="text-lg">Found users</h3>
  {/if}
  <div>
    {#each found_users as user (user.id)}
      <a href={'/user/' + user.id}>{user.user_name}</a>
      {#if !community_users.some((community_user) => community_user.user.id === user.id)}
        <button
          {disabled}
          class="btn variant-filled-primary py-1 my-2"
          on:click={() => invite_pressed(user)}
        >
          Invite
        </button>
      {:else}
        ({UsertoCommunityUser(community_users, user).relation.role})
        {#if UsertoCommunityUser(community_users, user).relation.role == 'MEMBER'}
          <button
            {disabled}
            class="btn variant-filled-error py-1 my-2"
            on:click={() =>
              kick_pressed(UsertoCommunityUser(community_users, user))}
          >
            Kick
          </button>
          <button
            class="btn variant-filled-primary py-1 my-2"
            {disabled}
            on:click={() =>
              promote_pressed(UsertoCommunityUser(community_users, user))}
          >
            Promote
          </button>
        {:else if UsertoCommunityUser(community_users, user).relation.role == 'REQUESTED'}
          <button
            {disabled}
            class="btn variant-filled-error py-1 my-2"
            on:click={() =>
              deny_pressed(UsertoCommunityUser(community_users, user))}
          >
            Deny
          </button>
          <button
            class="btn variant-filled-primary py-1 my-2"
            {disabled}
            on:click={() =>
              accept_pressed(UsertoCommunityUser(community_users, user))}
          >
            Accept
          </button>
        {/if}
      {/if}
    {/each}
  </div>
</div>
