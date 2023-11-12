<script lang="ts">
  export let page: number;
  export let limit: number;
  export let root: string;
  export let search: string | null;
  export let disabled: boolean;
</script>

<div class="group">
  {#if disabled}
    <button
      class="w-10 btn-icon h-10 variant-filled-primary rounded-none group-last:rounded-r-full group-first:rounded-l-full"
      disabled={true}>{page}</button
    >
  {:else}
    <a
      href="{root}?offset={(page - 1) * limit}&limit={Math.max(
        limit,
        1,
      )}{search && search.length > 0 ? '&search=' + search : ''}"
    >
      <button
        class="w-10 btn-icon h-10 variant-filled-primary rounded-none group-last:rounded-r-full group-first:rounded-l-full"
        >{page}</button
      ></a
    >
  {/if}
</div>
