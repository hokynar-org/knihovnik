<script lang="ts">
  export let text: string;
  export let href: string;
</script>

<div class="mt-4 text-center">
  <a class="text-muted" {href}>{text}</a>
</div>
