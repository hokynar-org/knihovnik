<script lang="ts">
  import { AppRail } from '@skeletonlabs/skeleton';
  import MenuItem from './MenuItem.svelte';
  import {
    faEnvelopeOpen,
    faHandshake,
    faRightLeft,
    faToolbox,
    faCube,
    faHandHolding,
    faUserGroup,
    faHouse,
  } from '@fortawesome/free-solid-svg-icons';

  export let isAdmin: boolean;
  export let current: string;
</script>

<AppRail>
  <MenuItem href="/" icon={faHouse} {current}>Home</MenuItem>
  <MenuItem href="/borrow" icon={faHandshake} {current}>Borrow</MenuItem>
  <MenuItem href="/offer" icon={faRightLeft} {current}>Offer</MenuItem>
  <MenuItem href="/borrow_request" icon={faEnvelopeOpen} {current}
    >Requests</MenuItem
  >
  <MenuItem href="/shelf" icon={faCube} {current}>Shelf</MenuItem>
  <MenuItem href="/communities" icon={faUserGroup} {current}>Community</MenuItem
  >

  <svelte:fragment slot="trail">
    {#if isAdmin}
      <MenuItem href="/admin" icon={faToolbox} {current}>Admin</MenuItem>
    {/if}
  </svelte:fragment>
</AppRail>
