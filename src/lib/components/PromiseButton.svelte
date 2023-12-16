<script lang="ts">
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
        console.log('Success');
        succes(value);
        disabled = false;
      })
      .catch(() => {
        console.log('fail');
        disabled = false;
      });
  }}
>
  <slot />
</button>
