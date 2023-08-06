<script lang="ts">
  import Fa from 'svelte-fa';
  import { AppRailAnchor } from '@skeletonlabs/skeleton';
  import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

  export let icon: IconDefinition;
  export let href: string;
  export let current: string;
</script>

<AppRailAnchor selected={current === href} {href}>
  <svelte:fragment slot="lead">
    <Fa {icon} />
  </svelte:fragment>
  <span><slot /></span>
</AppRailAnchor>
