<script lang="ts">
  import Fa from 'svelte-fa';
  import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
  import { editFieldsNo } from './stores';
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

  $: console.log('Edit fields no: ', $editFieldsNo);
  $editFieldsNo = $editFieldsNo + 1;
  $: {
    //Keeping track of how many editing fields we have
    if (editing) {
      editFieldsNo.update((n) => n + 1);
    } else {
      editFieldsNo.update((n) => n - 1);
    }
  }
</script>

<label>
  <span class="text-xl">{label}</span>
  <div class="w-full flex justify-between rounded-token mt-1">
    <input
      class="input text-base border-none w-full rounded-tl-token rounded-bl-token rounded-none"
      class:hidden={!editing}
      type="text"
      readonly={!editing}
      {name}
      bind:value
      bind:this={self}
    />
    <p class="max-w-xs mr-3" class:hidden={editing}>{value}</p>
    <button
      type="button"
      class="btn w-min rounded-tr-token rounded-br-token rounded-none variant-filled-primary"
      class:rounded-tl-token={!editing}
      class:rounded-bl-token={!editing}
      class:variant-filled-surface={editing}
      disabled={original != value}
      on:click={() => {
        editing = !editing;
        if (self) {
          self.focus();
          if (editing) {
            self.setSelectionRange(value.length, value.length);
          }
        }
      }}
    >
      <Fa class="self-center" icon={faPenToSquare} />
    </button>
  </div>
  <p class="text-error-300-600-token">{error ?? ''}</p>
</label>
