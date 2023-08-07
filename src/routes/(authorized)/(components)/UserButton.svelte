<script lang="ts">
  import Fa from 'svelte-fa';
  import { Avatar, popup } from '@skeletonlabs/skeleton';
  import { faDoorOpen, faSun, faUser } from '@fortawesome/free-solid-svg-icons';
  import type { PrivateUserSafe } from '$lib/types';
  import type { Writable } from 'svelte/store';

  export let user: PrivateUserSafe;
  export let darkMode: Writable<boolean>;

  function toggleDarkMode() {
    darkMode.update((v) => !v);
  }

  $: initials = user.full_name
    .split(' ')
    .map((w) => w[0])
    .join('');
</script>

<button
  use:popup={{
    event: 'click',
    target: 'profile',
    placement: 'bottom-end',
  }}
>
  <Avatar
    {initials}
    width="w-12"
    border="border-2 border-surface-300-600-token hover:!border-primary-500"
    cursor="cursor-pointer"
  />
</button>

<div class="card p-2 w-56 shadow-xl" data-popup="profile">
  <ol class="list-nav">
    <li>
      <a href="/user">
        <span class="badge"><Fa icon={faUser} /></span>
        <span>Profile</span>
      </a>
    </li>
    <hr class="my-1" />
    <li>
      <button on:click={toggleDarkMode}>
        <span class="badge"><Fa icon={faSun} /></span>
        <span>Toggle dark mode</span>
      </button>
    </li>
    <li class="text-error-500">
      <a href="/logout">
        <span class="badge"><Fa icon={faDoorOpen} /></span>
        <span>Log out</span>
      </a>
    </li>
  </ol>
  <div class="arrow bg-surface-100-800-token" />
</div>
