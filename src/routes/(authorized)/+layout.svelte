<script lang="ts">
  import { navigating } from '$app/stores';
  import Spinner from '$lib/components/Spinner.svelte';
  import {
    AppBar,
    AppRail,
    AppRailAnchor,
    AppShell,
  } from '@skeletonlabs/skeleton';

  export let data;

  $: user = data.user;
</script>

<svelte:head>
  <title>Knihovník</title>
</svelte:head>

<AppShell>
  <svelte:fragment slot="header">
    <AppBar>
      <AppRailAnchor href="/">Knihovník</AppRailAnchor>
    </AppBar>
  </svelte:fragment>
  <svelte:fragment slot="sidebarLeft">
    <AppRail>
      {@const isAdmin = user.role == 'ADMIN'}
      {#if isAdmin}
        <AppRailAnchor href="/admin">
          <span>Admin</span>
        </AppRailAnchor>
      {/if}
      <AppRailAnchor href="/borrow">
        <span>Borrow</span>
      </AppRailAnchor>
      <AppRailAnchor href="/offer">
        <span>Offer</span>
      </AppRailAnchor>
      <AppRailAnchor href="/user">
        <span>User</span>
      </AppRailAnchor>
      <AppRailAnchor href="/logout">
        <span>Logout</span>
      </AppRailAnchor>
      <!-- TODO: User info -->
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
