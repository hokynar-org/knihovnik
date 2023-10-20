<script lang="ts">
  import { goto } from '$app/navigation';
  import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  export let limit: number;
  export let offset: number;
  export let length: number;
  export let root: string;
  export let search: string | null;
  export let cls = '' as string;
</script>

<div class="flex gap-0 {cls}">
  <button
    disabled={!(offset - limit >= 0)}
    class="w-20 btn-icon h-10 variant-filled-primary rounded-r-none"
    on:click={() =>
      goto(
        root +
          '?offset=' +
          Math.max(offset - limit, 0) +
          '&limit=' +
          Math.max(limit, 1) +
          (search && search.length > 0 ? '&search=' + search : ''),
      )}
  >
    <Fa icon={faArrowLeft} />
  </button>
  <button
    disabled={!(offset + limit < length)}
    class="w-20 btn-icon h-10 variant-filled-primary rounded-l-none"
    on:click={() =>
      goto(
        root +
          '?offset=' +
          (offset + limit) +
          '&limit=' +
          Math.max(limit, 1) +
          (search && search.length > 0 ? '&search=' + search : ''),
      )}
  >
    <Fa icon={faArrowRight} />
  </button>
</div>
