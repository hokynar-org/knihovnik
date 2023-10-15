<script lang="ts">
  import { beforeNavigate, goto } from '$app/navigation';
  import { navigating, page } from '$app/stores';
  import Spinner from '$lib/components/Spinner.svelte';
  import { faBars, faBell } from '@fortawesome/free-solid-svg-icons';
  import Pusher from 'pusher-js';
  import {
    AppBar,
    AppShell,
    drawerStore,
    filter,
    storePopup,
  } from '@skeletonlabs/skeleton';
  import { Modal, modalStore } from '@skeletonlabs/skeleton';
  import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
  import {
    computePosition,
    autoUpdate,
    offset,
    shift,
    flip,
    arrow,
  } from '@floating-ui/dom';
  import Fa from 'svelte-fa';
  import UserButton from './(components)/UserButton.svelte';
  import Sidebar from './(components)/Sidebar.svelte';
  import AppDrawer from './(components)/AppDrawer.svelte';
  import { notifications, pusher } from '$lib/store';
  import type { Notification } from '$lib/types';
  import { editFieldsNo } from '$lib/components/EditingInput/stores';

  export let data;

  $: user = data.user;
  $: $notifications = data.notifications;
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
  $pusher = new Pusher(data.pusher.key, {
    cluster: data.pusher.cluster,
    userAuthentication: {
      endpoint: '/api/pusher/user',
      transport: 'ajax',
    },
    channelAuthorization: {
      endpoint: '/api/pusher/channel',
      transport: 'ajax',
    },
  });
  $pusher.signin();
  $pusher.user.bind('notification', (data: Notification) => {
    $notifications = [data, ...$notifications];
  });
  $: unread = $notifications.filter((notification) => {
    return !notification.read;
  }).length;
  $: uread_string = unread == 0 ? '' : String(unread);
  $: uread_string_brace = unread == 0 ? '' : '(' + String(unread) + ')';

  //Warn about unsaved data before navigating
  let editingAtLeastOne: boolean = false;
  $: {
    if ($editFieldsNo > 0) {
      editingAtLeastOne = true;
    } else {
      editingAtLeastOne = false;
    }
  }
  beforeNavigate(async ({ cancel, to }) => {
    if (editingAtLeastOne) {
      cancel();

      const prom = new Promise<boolean>((resolve) => {
        const unsavedEdit: ModalSettings = {
          type: 'confirm',
          title: 'You have unsaved work',
          body: 'Are you sure you wish to proceed?',
          response: (r: boolean) => {
            resolve(r);
          },
        };
        modalStore.trigger(unsavedEdit);
      });

      prom.then((r: any) => {
        //console.log('resolved response:', r);
        if (r) {
          editingAtLeastOne = false;
          //console.log('going');
          $editFieldsNo = 0;
          goto(to!.url);
        }
      });
    }
  });
</script>

<svelte:head>
  <title>Knihovník {uread_string_brace}</title>
</svelte:head>

<Modal />
<AppDrawer user={data.user} />
<AppShell>
  <svelte:fragment slot="header">
    <AppBar padding="p-2">
      <svelte:fragment slot="lead">
        <a class="text-2xl font-bold hidden md:block" href="/"> Knihovník </a>
        <button
          class="p-2 block md:hidden"
          on:click={() =>
            drawerStore.open({ id: 'mobile-menu', width: 'w-max-content' })}
        >
          <Fa icon={faBars} size="lg" />
        </button>
      </svelte:fragment>

      <div slot="trail" class="flex space-x-2">
        <button
          class="btn-icon"
          on:click={() =>
            drawerStore.open({
              id: 'notifications',
              width: 'md:!w-72',
              position: 'right',
              rounded: '!rounded-none',
            })}
        >
          <Fa icon={faBell} size="lg" />
          <div class="text-lg">
            {uread_string}
          </div>
        </button>
        <UserButton user={data.user} darkMode={data.darkMode} />
      </div>
      <!-- TODO: User info -->
    </AppBar>
  </svelte:fragment>

  <div class="h-full hidden md:block" slot="sidebarLeft">
    <Sidebar current={$page.url.pathname} isAdmin={user.role == 'ADMIN'} />
  </div>

  <main class="flex flex-col items-center relative px-2 py-8 h-full">
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
