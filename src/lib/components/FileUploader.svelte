<script lang="ts">
  import { faClose } from '@fortawesome/free-solid-svg-icons';
  import { FileDropzone } from '@skeletonlabs/skeleton';
  import Fa from 'svelte-fa';
  let localFiles: FileList | undefined;
  let uploadedFiles: { filename: string; previewUrl: string }[] = [];

  export let filenames: string[] = [];
  $: filenames = uploadedFiles.map(({ filename }) => filename);

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

      uploadedFiles.push({ filename, previewUrl });
      uploadedFiles = uploadedFiles;
    });
  };

  const deleteImage = (index: number) => {
    uploadedFiles.splice(index, 1);
    uploadedFiles = uploadedFiles;
  };
</script>

<div class="dropzone-previews flex flex-row gap-4 mt-4 mb-4 flex-wrap">
  {#each uploadedFiles as { previewUrl: url }, i (url)}
    <div
      class="p-0 border-2 rounded-container-token border-surface-500 bg-surface-500 overflow-hidden relative"
    >
      <img src={url} class="max-h-16" />
      <span
        class="block absolute top-1 right-1 rounded-full bg-surface-400 hover:bg-surface-700 cursor-pointer"
        on:click={() => deleteImage(i)}
        on:keypress={({ key }) => {
          if (key === 'Enter') deleteImage(i);
        }}
        role="button"
        tabindex="0"
        aria-label="Delete image {i}"
      >
        <Fa icon={faClose} class="aspect-square" />
      </span>
    </div>
  {/each}
</div>
<FileDropzone
  name="picture"
  bind:files={localFiles}
  on:change={localFileAdded}
  multiple
/>
