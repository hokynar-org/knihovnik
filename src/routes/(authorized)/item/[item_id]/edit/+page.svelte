<script lang="ts">
  import { goto, beforeNavigate } from '$app/navigation';
  import PromiseButton from '$lib/components/PromiseButton.svelte';
  import ReadOnlyTextFieldInput from '$lib/components/EditingInput/ReadOnlyTextFieldInput.svelte';
  import ReadOnlyTextInput from '$lib/components/EditingInput/ReadOnlyTextInput.svelte';
  import OptionPicker from '$lib/components/OptionPicker.svelte';
  import IconSelector from '$lib/components/IconSelector/IconSelector.svelte';
  import {
    faHandHoldingHand,
    faHandHolding,
    faHandsHolding,
  } from '@fortawesome/free-solid-svg-icons';
  import { superForm } from 'sveltekit-superforms/client';
  import FileUploader from '$lib/components/FileUploader.svelte';
  export let data;
  const { form, errors } = superForm(data.form);
  $: item = data.item;
  $: community_visibility = data.community_visibility;
  $: $form.name = data.item.name;
  $: $form.description = data.item.description;
  $: $form.transferType = data.item.transfeType as
    | 'BORROW'
    | 'GIVE'
    | 'TRANSITIVE';
  $: $form.transferType = transferType;
  const old_name = data.item.name;
  const old_description = data.item.description;
  const old_transferType = data.item.transfeType as
    | 'BORROW'
    | 'GIVE'
    | 'TRANSITIVE';
  const old_hasMainPic = data.item.hasMainPic;
  const old_iconName = data.item.iconName;
  $: disabled =
    old_name == $form.name &&
    old_description == $form.description &&
    old_transferType == $form.transferType &&
    !imageChange;
  $: toNewIcon = !hasMainPic && selectedIconName != old_iconName;
  $: toNewImage = hasMainPic && fileName;
  $: imageChange = toNewIcon || toNewImage;

  let transferType: 'BORROW' | 'GIVE' | 'TRANSITIVE' = old_transferType;

  let hasMainPic = data.item.hasMainPic;
  let selectedIconName: string | null = data.item.iconName;
  let fileName: string | null = null;

  function changeMain(): void {
    hasMainPic = !hasMainPic;
    // if (hasMainPic) {
    //   selectedIconName = null;
    // } else {
    //   selectedIconName = data.item.iconName;
    // }
  }

  const change_visibility = async (community_id: string) => {
    const res = await fetch(
      '/api/item/' + item.id + '/' + community_id + '/visibility',
      {
        method: 'POST',
      },
    );
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as {
      item_id: string | null;
      community_id: string | null;
    } | null;
  };
  const hide_all = async () => {
    const res = await fetch('/api/item/' + item.id + '/hide_all', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as {
      item_id: string | null;
      community_id: string | null;
    } | null;
  };
  const show_all = async () => {
    const res = await fetch('/api/item/' + item.id + '/show_all', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return (await res.json()) as {
      item_id: string | null;
      community_id: string | null;
    } | null;
  };
  const deleteItem = async () => {
    const response = await fetch('/api/item/' + item.id + '/remove', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
  };
</script>

<div class="mt-8">
  <div>
    <form method="POST" action="?/edit" class="grid grid-cols-1 gap-4">
      <ReadOnlyTextInput
        label="Name"
        name="name"
        bind:value={$form.name}
        error={$errors.name}
      />
      <ReadOnlyTextFieldInput
        label="Description"
        name="description"
        bind:value={$form.description}
        error={$errors.description}
      />
      <h4 class="text-2xl">Transfer type</h4>
      <input name="transferType" bind:value={transferType} class="hidden" />
      <input name="files" bind:value={fileName} class="hidden" />
      <input name="hasMainPic" bind:value={hasMainPic} class="hidden" />
      <input name="iconName" bind:value={selectedIconName} class="hidden" />
      <OptionPicker
        options={[
          { name: 'Borrow', value: 'BORROW', icon: faHandHolding },
          { name: 'Transitive', value: 'TRANSITIVE', icon: faHandHoldingHand },
          { name: 'Give', value: 'GIVE', icon: faHandsHolding },
        ]}
        bind:selected={transferType}
      />
      <div class="flex content-center justify-center mt-2">
        <ol class="breadcrumb w-auto">
          <li class:text-lg={hasMainPic} class:text-base={!hasMainPic}>
            {#if hasMainPic}
              Upload
            {:else}
              <button class="font-bold" on:click={changeMain}>Upload</button>
            {/if}
          </li>
          <li class="crumb-separator text-lg" aria-hidden>/</li>

          <li class:text-lg={!hasMainPic} class:text-base={hasMainPic}>
            {#if !hasMainPic}
              Presets
            {:else}
              <button class="font-bold" on:click={changeMain}>Presets</button>
            {/if}
          </li>
        </ol>
      </div>

      <div class="mb-4 mt-3">
        {#if hasMainPic}
          <FileUploader bind:fileName />
        {:else}
          <IconSelector bind:selectedIconName />
        {/if}
      </div>
      <div class="self-end justify-self-center col-span-full">
        <button {disabled} class="btn variant-filled-primary" type="submit"
          >Save changes</button
        >
      </div>
    </form>
  </div>

  <div class="mt-6">
    <h4 class="text-2xl mt-6">Visibility settings</h4>
    <p class="text-sm">Which communities can see and borrow this item?</p>
    <div class="grid grid-cols-2 justify-items-center mt-4">
      <span>
        <PromiseButton
          disabled={community_visibility.filter((value) => {
            return value.item_visibility;
          }).length == 0}
          callback={async () => {
            return await hide_all();
          }}
          succes={(value) => {
            community_visibility = community_visibility.flatMap((fvalue) => {
              return {
                user_community_relations: fvalue.user_community_relations,
                communities: fvalue.communities,
                item_visibility: null,
              };
            });
          }}
          btn_class={'btn variant-filled-error py-1 my-2'}
          >Hide All</PromiseButton
        >
      </span>
      <span>
        <PromiseButton
          disabled={community_visibility.filter((value) => {
            return !value.item_visibility;
          }).length == 0}
          callback={async () => {
            return await show_all();
          }}
          succes={(value) => {
            community_visibility = community_visibility.flatMap((fvalue) => {
              return {
                user_community_relations: fvalue.user_community_relations,
                communities: fvalue.communities,
                item_visibility: {
                  community_id: fvalue.communities.id,
                  item_id: item.id,
                },
              };
            });
          }}
          btn_class={'btn variant-filled-primary py-1 my-2'}
          >Show All</PromiseButton
        >
      </span>
    </div>
    <div class="mt-2">
      <ol class="grid justify-items-center">
        {#each community_visibility as visibility (visibility.communities.id)}
          <li
            class="inline-grid grid-cols-3 justify-items-center items-baseline"
          >
            <span>
              <a href={'/community/' + visibility.communities.id}
                >{visibility.communities.name}</a
              >
            </span>
            <span>
              {#if visibility.item_visibility}
                <p>Visible</p>
              {:else}
                <p>Hidden</p>
              {/if}
            </span>
            <span>
              <PromiseButton
                disabled={false}
                callback={async () => {
                  return await change_visibility(visibility.communities.id);
                }}
                succes={(value) => {
                  const index = community_visibility.indexOf(visibility);
                  community_visibility[index].item_visibility = value;
                }}
                btn_class={'btn variant-filled-primary py-1 my-2'}
                >Change</PromiseButton
              >
            </span>
          </li>
        {/each}
      </ol>
    </div>
  </div>

  <div class="mt-6">
    <h4 class="text-2xl">Deletion</h4>
    <p class="mb-2">Warning: this cannot be undone.</p>

    <div class="grid justify-items-center">
      <PromiseButton
        btn_class={'btn variant-filled-error py-1 my-2'}
        callback={deleteItem}
        succes={() => {
          goto('/offer');
        }}
        disabled={false}
      >
        Delete Item
      </PromiseButton>
    </div>
  </div>
</div>
