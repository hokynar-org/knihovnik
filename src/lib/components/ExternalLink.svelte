<script lang="ts">
  import Fa from 'svelte-fa';
  import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

  export let href: string;
  export let rel: string | undefined = undefined;
</script>

<a {href} {rel}>
  <span>
    <slot />
  </span>
  <i>
    <Fa size="xs" icon={faArrowUpRightFromSquare} />
  </i>
</a>

<style>
  span {
    display: inline-block;
  }
  span:hover {
    text-decoration: underline;
  }

  i {
    margin-left: 0.1em;
    display: inline-block;
  }
</style>
