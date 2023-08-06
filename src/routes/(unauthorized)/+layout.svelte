<script>
  import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell slotPageContent="flex flex-col items-center">
  <slot />

  <footer class="mt-auto text-center text-surface-500-400-token p-2">
    Knihovník by Hokynář <span class="inline-block mx-2">|</span> 2023
  </footer>
</AppShell>
