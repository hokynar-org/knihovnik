<script lang="ts">
  import { onMount } from 'svelte';
  import Fa from 'svelte-fa';
  import type { PublicItemSafe, PublicUserSafe } from '$lib/types';
  export let item: PublicItemSafe;
  export let owner: PublicUserSafe | null;
  export let holder: PublicUserSafe | null;

  import { iconList } from '../IconSelector/iconList';
  const imageAltText = 'todo: change this';

  let clamped = true;
  function toggleClamp() {
    clamped = !clamped;
  }

  var fontSize = 16;
  onMount(() => {
    // get dom element by id
    const element = document.getElementById('textbox');

    if (element) {
      const computedStyle = window.getComputedStyle(element);
      //lineHeight = parseFloat(computedStyle.getPropertyValue('line-height')); //Alternative, not used
      fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
    }
  });
</script>

<div
  id="oneCard"
  class="w-80 h-min rounded shadow-lg bg-surface-800 overflow-visible"
>
  <div class="flex h-40 justify-center items-center py-auto">
    {#if item.image_src !== null}
      <a href="/item/{item.id}/" class="h-[100%] w-[100%]">
        <img
          class="object-cover w-[100%] h-[100%] max-h-60 rounded"
          src={item.image_src}
          alt={imageAltText}
        />
      </a>
    {:else}
      <a href="/item/{item.id}/" class="w-[100%] py-auto">
        <div class="flex justify-center w-[100%]">
          <Fa size="4x" icon={iconList[10]} />
        </div>
      </a>
    {/if}
  </div>

  <div class="pt-1 px-2 1 h-auto overflow-visible">
    <div>
      <h4 class="py-1 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
        <a href="/item/{item.id}">{item.name}</a>
      </h4>
    </div>
    <div
      id="textbox"
      style="--fsize:{fontSize}"
      class="mt-2 min-h-12e text-min-height"
      class:line-clamp={clamped}
      class:overflow-hidden={clamped}
      on:click={toggleClamp}
      on:keypress={toggleClamp}
      role="button"
      tabindex="0"
    >
      {item.description}
    </div>
  </div>
  <div class="mt-2 px-2 pt-2">
    <slot />
  </div>

  {#if $$slots.name}
    <div class="mt-2"></div>
  {/if}
</div>

<style>
  .text-min-height {
    min-height: calc(1.5 * var(--fsize) * 1px * 4); /* 4 lines of text */
  }

  .text-max-height {
    max-height: calc(1.5 * var(--fsize) * 1px * 4); /* 4 lines of text */
  }
</style>
