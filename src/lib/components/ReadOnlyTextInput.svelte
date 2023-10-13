<script lang="ts">
  import Fa from 'svelte-fa';
  import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
  let disabled = true;
  let editing = false;
  export let value: string;
  const original = value;
  export let label: string;
  export let name: string;
  export let error: string[] | undefined;
  let self: HTMLInputElement;
  function init(el: HTMLInputElement) {
    self = el;
  }
</script>

<label>
  <span class="text-xl">{label}</span>
  <div class="w-full flex justify-between rounded-token mt-1">
    {#if editing}
      <input
        class="input text-base border-none w-full rounded-tl-token rounded-bl-token rounded-none"
        type="text"
        readonly={!editing}
        {name}
        bind:value
        use:init
      />
    {:else}
      <p class="max-w-xs">{value}</p>
    {/if}
    <button
      type="button"
      class="btn w-min rounded-tr-token rounded-br-token rounded-none variant-filled-primary"
      class:rounded-tl-token={!editing}
      class:rounded-bl-token={!editing}
      class:variant-filled-surface={editing}
      disabled={original != value}
      on:click={() => {
        editing = !editing;
        self.focus();
        if (editing) {
          self.setSelectionRange(value.length, value.length);
        }
      }}
    >
      <Fa class="self-center" icon={faPenToSquare} />
    </button>
  </div>
  <p class="text-error-300-600-token">{error ?? ''}</p>
</label>
