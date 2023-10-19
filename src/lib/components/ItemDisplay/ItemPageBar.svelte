<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    faArrowLeft,
    faArrowRight,
    faMagnifyingGlass,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  export let limit: number;
  export let length: number;
  export let offset: number;
  export let root: string;
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
  export let search: string | null = null;
</script>

<div class="grid grid-cols-[5fr,1fr] mt-6 gap-2 items-center w-min-fit">
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
  <div class="grid grid-cols-2">
    {#if offset - limit >= 0}
      <a
        class="w-fit btn-icon h-10 variant-filled-primary rounded-r-none"
        href="{root}?offset={Math.max(offset - limit, 0)}&limit={Math.max(
          limit,
          1,
        )}{search && search.length > 0 ? '&search=' + search : ''}"
      >
        <Fa icon={faArrowLeft} />
      </a>
    {:else}
      <button
        disabled={true}
        class="w-fit btn-icon h-10 variant-filled-primary rounded-r-none"
      >
        <Fa icon={faArrowLeft} />
      </button>
    {/if}
    {#if offset + limit < length}
      <a
        class="w-fit btn-icon h-10 variant-filled-primary rounded-l-none"
        href="{root}?offset={offset + limit}&limit={Math.max(
          limit,
          1,
        )}{search && search.length > 0 ? '&search=' + search : ''}"
      >
        <Fa icon={faArrowRight} />
      </a>
    {:else}
      <button
        disabled={true}
        class="w-fit btn-icon h-10 variant-filled-primary rounded-l-none"
      >
        <Fa icon={faArrowRight} />
      </button>
    {/if}
  </div>
</div>
