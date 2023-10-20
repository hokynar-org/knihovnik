<script lang="ts">
  import { goto } from '$app/navigation';
  import Fa from 'svelte-fa';
  import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
  import ItemPaginator from './ItemPaginator.svelte';
  export let limit: number;
  export let length: number;
  export let offset: number;
  export let root: string;
  export let search: string | null = null;

  function enterPressed(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.code === 'Enter') {
      goto(
        root +
          '?offset=0&limit=' +
          limit +
          (search && search.length > 0 ? '&search=' + search : ''),
      );
    }
  }

  let leftURL = '' as string;

  $: leftURL =
    root +
    '?offset=' +
    Math.max(offset - limit, 0) +
    '&limit=' +
    Math.max(limit, 1) +
    (search && search!.length > 0 ? '&search=' + search : '');
  $: console.log(leftURL);
</script>

<div class="grid grid-cols-2 mt-6 gap-2 items-center w-min-fit">
  <div class="input-group input-group-divider flex">
    <input
      type="search"
      class="input w-full"
      placeholder="Search..."
      on:keydown={enterPressed}
      bind:value={search}
    />
    <a
      class="variant-filled-primary w-fit"
      href="{root}?offset={0}&limit={limit}{search && search.length > 0
        ? '&search=' + search
        : ''}"
    >
      <Fa icon={faMagnifyingGlass} />
    </a>
  </div>
  <ItemPaginator {offset} {limit} {root} {search} {length} />
</div>
