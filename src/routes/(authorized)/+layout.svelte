<script lang="ts">
  import { navigating, page } from '$app/stores';
  import Spinner from '$lib/components/Spinner.svelte';
  import {
    faDoorOpen,
    faHandshake,
    faRightLeft,
    faToolbox,
    faUser,
  } from '@fortawesome/free-solid-svg-icons';
  import { AppBar, AppRail, AppShell } from '@skeletonlabs/skeleton';
  import MenuItem from './MenuItem.svelte';

  export let data;

  $: user = data.user;

  $page.url.pathname;
</script>

<svelte:head>
  <title>Knihovník</title>
</svelte:head>

<AppShell>
  <svelte:fragment slot="header">
    <AppBar>
      <a class="text-2xl font-bold" href="/">Knihovník</a>
      <!-- TODO: User info -->
    </AppBar>
  </svelte:fragment>

  <svelte:fragment slot="sidebarLeft">
    {@const current = $page.url.pathname}
    <AppRail>
      <MenuItem href="/borrow" icon={faHandshake} {current}>Borrow</MenuItem>
      <MenuItem href="/offer" icon={faRightLeft} {current}>Offer</MenuItem>
      <MenuItem href="/user" icon={faUser} {current}>User</MenuItem>

      <svelte:fragment slot="trail">
        {@const isAdmin = user.role == 'ADMIN'}
        {#if isAdmin}
          <MenuItem href="/admin" icon={faToolbox} {current}>Admin</MenuItem>
        {/if}
        <MenuItem href="/logout" icon={faDoorOpen} {current}>Logout</MenuItem>
      </svelte:fragment>
    </AppRail>
  </svelte:fragment>

  <main class="flex flex-col items-center relative p-2 h-full">
    <slot />
    {#if $navigating}
      <div
        class="absolute inset-0 bg-surface-backdrop-token grid place-items-center"
      >
        <Spinner />
      </div>
    {/if}
  </main>
</AppShell>
