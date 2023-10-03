<script lang="ts">
  import BallSelect from './BallSelect.svelte';
  import Fa from 'svelte-fa';
  import {
    faBook,
    faScrewdriverWrench,
    faChair,
    faMicrochip,
    faCampground,
    faSprayCanSparkles,
    faGamepad,
    faVolleyball,
    faDiceD20,
    faShirt,
    faStar,
  } from '@fortawesome/free-solid-svg-icons';
</script>

<div class="grid grid-cols-4 gap-y-2 gap-x-2">
  <BallSelect no={1}><Fa size="2x" icon={faBook} /></BallSelect>
  <BallSelect no={2}><Fa size="2x" icon={faScrewdriverWrench} /></BallSelect>
  <BallSelect no={3}><Fa size="2x" icon={faMicrochip} /></BallSelect>
  <BallSelect no={4}><Fa size="2x" icon={faChair} /></BallSelect>
  <BallSelect no={5}><Fa size="2x" icon={faCampground} /></BallSelect>
  <BallSelect no={6}><Fa size="2x" icon={faSprayCanSparkles} /></BallSelect>
  <BallSelect no={7}><Fa size="2x" icon={faGamepad} /></BallSelect>
  <BallSelect no={8}><Fa size="2x" icon={faVolleyball} /></BallSelect>
  <BallSelect no={9}><Fa size="2x" icon={faDiceD20} /></BallSelect>
  <BallSelect no={10}><Fa size="2x" icon={faShirt} /></BallSelect>
  <BallSelect no={11}><Fa size="2x" icon={faStar} /></BallSelect>
</div>
