<script lang="ts">
  import { FileDropzone } from '@skeletonlabs/skeleton';
  let localFiles: FileList | undefined;
  export let files: string[] = [];

  const localFileAdded = () => {
    if (localFiles === undefined) return;
    const newFiles = Array.from(localFiles);
    localFiles = undefined;

    const promises = newFiles.map(async (file) => {
      const res = await fetch('/upload?type=' + encodeURIComponent(file.type));

      if (!res.ok) {
        console.error('error:', (await res.json()).message);
        return;
      }

      const { filename, url }: Record<any, string> = await res.json();

      const upload = await fetch(url, { method: 'POST', body: file });

      files.push(filename);
      return await upload.text();
    });

    Promise.all(promises).then(console.log);
  };
</script>

<div></div>
<FileDropzone
  name="picture"
  bind:files={localFiles}
  on:change={localFileAdded}
/>
