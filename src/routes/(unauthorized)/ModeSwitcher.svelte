<script lang="ts">
  export let text: string;
  export let href: string;
</script>

<div class="mt-4 text-center text-surface-500-400-token">
  <a class="underline" {href}>{text}</a>
</div>
