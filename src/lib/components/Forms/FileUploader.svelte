<script lang="ts">
  import { faClose } from '@fortawesome/free-solid-svg-icons';
  import { FileDropzone } from '@skeletonlabs/skeleton';
  import Fa from 'svelte-fa';
  let localFiles: FileList | undefined;
  let uploadedFile: { filename: string; previewUrl: string } | null = null;

  export let fileName: string | null = null;
  $: fileName = uploadedFile?.filename ? uploadedFile?.filename : null;

  const localFileAdded = () => {
    if (localFiles === undefined) return;
    const newFiles = Array.from(localFiles);
    localFiles = undefined;

    newFiles.forEach(async (file) => {
      const res = await fetch('/upload?type=' + encodeURIComponent(file.type));

      if (!res.ok) {
        console.error('error:', (await res.json()).message);
        return;
      }

      const { filename, url, previewUrl }: Record<any, string> =
        await res.json();

      const upload = await fetch(url, { method: 'PUT', body: file });
      if (!upload.ok) {
        console.error('error:', upload.status, await upload.text());
        return;
      }

      //You can only upload 1 file -> to simplify things
      //uploadedFiles.push({ filename, previewUrl });
      uploadedFile = { filename, previewUrl };
    });
  };

  const deleteImage = () => {
    uploadedFile = null;
  };
</script>

<div class="h-40">
  {#if uploadedFile}
    <div
      class="p-0 w-fit border-2 rounded-container-token border-surface-500 bg-surface-500 overflow-hidden relative"
    >
      <img
        src={uploadedFile.previewUrl}
        class="max-h-40"
        alt={uploadedFile.previewUrl}
      />
      <span
        class="block absolute top-1 right-1 rounded-full bg-surface-400 hover:bg-surface-700 cursor-pointer"
        on:click={() => deleteImage()}
        on:keypress={({ key }) => {
          if (key === 'Enter') deleteImage();
        }}
        role="button"
        tabindex="0"
        aria-label="Delete image"
      >
        <Fa icon={faClose} class="aspect-square" />
      </span>
    </div>
  {:else}
    <FileDropzone
      name="picture"
      bind:files={localFiles}
      on:change={localFileAdded}
      multiple
      regionInterface="!h-24"
    />
  {/if}
</div>
