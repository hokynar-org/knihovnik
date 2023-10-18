<script lang="ts">
  import Fa from 'svelte-fa';
  import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
  import { editFieldsNo } from './stores';

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
    <textarea
      class="input text-base resize-none border-none w-full rounded-tl-token rounded-bl-token rounded-none"
      {rows}
      {name}
      readonly={!editing}
      bind:value
      bind:this={self}
      class:hidden={!editing}
    />
    <p class="max-w-sm mr-3" class:hidden={editing}>
      {@html value.replace(/\n/g, '<br>')}
    </p>
    <button
      type="button"
      class="btn w-min rounded-tr-token rounded-none variant-filled-primary rounded-br-token"
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
