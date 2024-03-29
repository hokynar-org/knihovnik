<script lang="ts">
  import { goto, invalidate, invalidateAll } from '$app/navigation';
  import PromiseButton from '$lib/components/Utilities/PromiseButton.svelte';
  import ReadOnlyTextFieldInput from '$lib/components/EditingInput/ReadOnlyTextFieldInput.svelte';
  import ReadOnlyTextInput from '$lib/components/EditingInput/ReadOnlyTextInput.svelte';
  import IconSelector from '$lib/components/IconSelector/IconSelector.svelte';
  import { superForm } from 'sveltekit-superforms/client';
  import FileUploader from '$lib/components/Forms/FileUploader.svelte';
  import type { BorrowMode } from '$lib/types.js';
  import { onMount } from 'svelte';
  import {
    Modal,
    modalStore,
    type ModalSettings,
    RadioItem,
    RadioGroup,
  } from '@skeletonlabs/skeleton';
  import PickBorrowType from '$lib/components/Forms/PickBorrowType.svelte';

  export let data;
  const { form, errors } = superForm(data.form);
  $: item = data.item;
  $: community_visibility = data.community_visibility;
  $: $form.name = data.item.name;
  $: $form.description = data.item.description;
  $: $form.transferType = data.item.transfeType as BorrowMode;

  let old_name: string, old_description: string, old_transferType: BorrowMode;
  let old_hasMainPic: Boolean, old_iconName: string | null;

  function updateOld() {
    //We have to run this function on when we start this component
    //and everytime we submit a form
    console.log(data.item.description);
    old_name = $form.name;
    old_description = $form.description;
    old_transferType = $form.transferType as BorrowMode;
    old_hasMainPic = $form.hasMainPic;
    old_iconName = $form.iconName;
  }

  $: disabled =
    old_name == $form.name &&
    old_description == $form.description &&
    old_transferType == $form.transferType &&
    !imageChange;
  $: console.log('d'), console.log(disabled);
  $: console.log(old_name == $form.name);
  $: console.log(old_description == $form.description);
  $: console.log(old_description);
  $: console.log($form.description);

  $: toNewIcon = !hasMainPic && selectedIconName != old_iconName;
  $: toNewImage = hasMainPic && fileName;
  $: imageChange = toNewIcon || toNewImage;

  //Initial values of data used in forms
  //let transferType: 'BORROW' | 'GIVE' | 'TRANSITIVE' = data.item.transfeType as BorrowModes;
  let hasMainPic = data.item.hasMainPic;
  let selectedIconName: string | null = data.item.iconName;
  let fileName: string | null = null;
  $: if (fileName) {
    $form.files = fileName;
  } else {
    //In case user selects the image from the picker and then cancels
    $form.files = '';
  }
  $: if (selectedIconName) {
    $form.iconName = selectedIconName;
  }
  $: $form.hasMainPic = hasMainPic;

  let radioValue = 0;
  //$: radioValue = Number(!hasMainPic) % 2;
  $: hasMainPic = !Boolean(radioValue);

  async function handleSubmit(
    content: object,
    updateFunc: () => void,
  ): Promise<void> {
    try {
      const respBody = new URLSearchParams();
      Object.entries(content).forEach(([key, value]) => {
        respBody.append(key, value);
      });
      const response = await fetch('?/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Upgrade-Insecure-Requests': '1',
        },
        body: respBody.toString(),
      });

      if (response.ok) {
        // Handle success (e.g., show a success message)
        //console.log('Form submitted successfully');
        updateFunc();
      } else {
        // Handle errors (e.g., show an error message)
        //console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
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

  const pushDelete = async () => {
    const result = await new Promise<boolean>((resolve, reject) => {
      const AreYouSure: ModalSettings = {
        type: 'confirm',
        title: 'This operation cannot be undone',
        body: 'Are you sure you want to do it?',
        response: (r: boolean) => {
          resolve(r);
        },
      };
      modalStore.trigger(AreYouSure);
    });

    if (result) {
      deleteItem();
    } else {
      throw new Error('Deleting aborted');
    }
  };
  const deleteItem = async () => {
    const response = await fetch('/api/item/' + item.id + '/remove', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
  };

  let updates_main_form = 0;

  onMount(async () => {
    updateOld();
  });
</script>

<div class="mt-6 w-80 md:w-96 lg:w-[42rem]">
  <div>
    <form
      on:submit|preventDefault={() =>
        handleSubmit($form, () => {
          updates_main_form++;
          updateOld();
        })}
      class="grid grid-cols-1 gap-4"
    >
      {#key updates_main_form}
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
        <h3 class="text-xl mt-2 mb-[-1rem]">Transfer type</h3>
        <PickBorrowType bind:selectedType={$form.transferType} />
        <input
          name="transferType"
          bind:value={$form.transferType}
          class="hidden"
        />
        <input name="files" bind:value={fileName} class="hidden" />
        <input name="hasMainPic" bind:value={hasMainPic} class="hidden" />
        <input name="iconName" bind:value={selectedIconName} class="hidden" />
        <div class="flex content-center justify-center mt-2">
          <RadioGroup
            active="variant-filled-primary"
            hover="hover:variant-soft-primary"
          >
            <RadioItem bind:group={radioValue} name="justify" value={0}
              >Upload</RadioItem
            >
            <RadioItem bind:group={radioValue} name="justify" value={1}
              >Presets</RadioItem
            >
          </RadioGroup>
        </div>

        <div class="mb-4 mt-3">
          {#if hasMainPic}
            <FileUploader bind:fileName />
          {:else}
            <IconSelector bind:selectedIconName />
          {/if}
        </div>
      {/key}
      <div class="self-end justify-self-center col-span-full">
        <button {disabled} class="btn variant-filled-primary" type="submit"
          >Save changes</button
        >
      </div>
    </form>
  </div>

  <div class="mt-6">
    <h3 class="text-2xl mt-6">Visibility settings</h3>
    <p class="text-base">Which communities can see and borrow this item?</p>
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
    <h3 class="text-2xl">Deletion</h3>

    <div class="grid justify-items-center">
      <PromiseButton
        btn_class={'btn variant-filled-error py-1 my-2'}
        callback={pushDelete}
        succes={async () => {
          await goto('/offer');
          //When we go back, do not display the deleted item
          //in the list of items. Idk if there is a better
          //way to do this without reloading
          invalidateAll();
          location.reload();
        }}
        disabled={false}
      >
        Delete Item
      </PromiseButton>
    </div>
  </div>
</div>
