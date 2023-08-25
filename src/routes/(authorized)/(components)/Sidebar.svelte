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
  } from '@fortawesome/free-solid-svg-icons';

  export let isAdmin: boolean;
  export let current: string;
</script>

<AppRail>
  <MenuItem href="/borrow" icon={faHandshake} {current}>Borrow</MenuItem>
  <MenuItem href="/offer" icon={faRightLeft} {current}>Offer</MenuItem>
  <MenuItem href="/borrow_request" icon={faEnvelopeOpen} {current}
    >Requests</MenuItem
  >
  <MenuItem href="/borrowed" icon={faCube} {current}>Borrowed</MenuItem>
  <MenuItem href="/lended" icon={faHandHolding} {current}>Lended</MenuItem>

  <svelte:fragment slot="trail">
    {#if isAdmin}
      <MenuItem href="/admin" icon={faToolbox} {current}>Admin</MenuItem>
    {/if}
  </svelte:fragment>
</AppRail>
