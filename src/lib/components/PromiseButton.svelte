<script lang="ts">
  import { string } from 'zod';

  export let disabled: boolean;
  export let btn_class: string;
  export let callback: () => Promise<any>;
  export let succes: (value: any) => void;
</script>

<button
  {disabled}
  class={btn_class}
  on:click={() => {
    disabled = true;
    callback()
      .then((value) => {
        succes(value);
        disabled = false;
      })
      .catch(() => {
        disabled = false;
      });
  }}
>
  <slot />
</button>
