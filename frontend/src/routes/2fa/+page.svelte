<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

    import Navbar from "$lib/home/Navbar.svelte";
    import TwoFaCodeForm from "$lib/twoFA/TwoFaCodeForm.svelte";
    import NothingToSee from "$lib/error/nothingToSee.svelte";

    import { twoFaLocked } from "$lib/stores/twoFaLockedState";


</script>


  <h1>TRANSCENDENCE</h1>
  {#if $twoFaLocked}
    <TwoFaCodeForm />
  {:else}
    <NothingToSee />
  {/if}

<style>

h1
{
  position: sticky;
  text-align: center;
  font-family: "Doctor Glitch";
  font-size: 60px;
  opacity: 0.6;
  color: white;
  clear: both;
  margin-top: 20px;
}
  
</style>