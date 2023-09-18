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
  let self: HTMLTextAreaElement;
  function init(el: HTMLTextAreaElement) {
    self = el;
  }

  export let rows = 8;
</script>

<label>
  <span class="text-xl">{label}</span>
  <div class="w-full flex justify-between rounded-token mt-1">
    <textarea
      class="input text-base resize-none border-none w-full rounded-tl-token rounded-bl-token rounded-none"
      {rows}
      {name}
      readonly={!editing}
      bind:value
      use:init
    />
    {#if editing}
      <button
        type="button"
        class="btn w-min rounded-tr-token rounded-none variant-filled-surface rounded-br-token"
        disabled={original != value}
        on:click={() => {
          editing = !editing;
          if (editing) {
            self.focus();
          }
        }}
      >
        <Fa class="self-center" icon={faPenToSquare} />
      </button>
    {:else}
      <button
        type="button"
        class="btn w-min rounded-tr-token rounded-none variant-filled-primary rounded-br-token"
        disabled={original != value}
        on:click={() => {
          editing = !editing;
          self.focus();
          self.setSelectionRange(value.length, value.length);
        }}
      >
        <Fa class="self-center" icon={faPenToSquare} />
      </button>
    {/if}
  </div>
  <p class="text-error-300-600-token">{error ?? ''}</p>
</label>
