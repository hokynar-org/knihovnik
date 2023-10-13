<script lang="ts">
  import { onMount } from 'svelte';
  let fontSize = 16; //1 rem = this much px
  let width = 1352;
  let containerWidth = 1352;

  export let cardWidth = 20;
  export let cardGap = 1.5;
  export let cls = '';

  //$: console.log(containerWidth);
  //Choose a maximum amount of rows, but have the width be fit to the rows.
  //A horrible solution that doesn't update often
  //desired width:
  //n * 20rem + (n-1)1.5rem = n*(21.5rem) - 1.5rem
  //20rem = card width
  //1.5rem = gap between cards
  //Equation:
  //n*(21.5rem) - 1.5rem = maxwidth -> and then n floor
  $: maxwidth = containerWidth * 0.95;
  $: n = Math.floor(
    (maxwidth + 1.95 * fontSize) / ((cardWidth + cardGap) * fontSize),
  );
  $: width = (n * (cardWidth + cardGap) - cardGap) * fontSize;
  //$: console.log('n: ' + String(n));
  //$: console.log('width: ' + String(width));
  //$: console.log('font-size: ' + String(fontSize));
  onMount(() => {
    let reference = document.getElementById('measuring');
    if (reference) {
      const computedStyle = window.getComputedStyle(reference);
      fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
    }
  });
</script>

<div id="measuring" bind:clientWidth={containerWidth} class="w-[100%]"></div>
<div
  class="flex flex-wrap flex-shrink custom-width gap-6 {cls}"
  style="--my-width:{width}"
>
  <slot />
</div>

<style>
  .custom-width {
    width: calc(var(--my-width) * 1px);
  }
</style>
