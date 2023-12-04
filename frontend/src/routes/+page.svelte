<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";

    import Navbar from "../lib/home/Navbar.svelte";
    import Auth, { logIn } from "$lib/home/Auth.svelte";

    import { twoFaLocked } from "$lib/stores/twoFaLockedState";
    import { loggedIn } from "$lib/stores/loggedStore";


    onMount(() => {
      if ($twoFaLocked)
      {
        goto("/2fa");
        return ;
      }

      if (!$loggedIn)
      {
        console.log("login attempt");
        logIn();
      }
  });

  onMount(logIn);

</script>

<div class=title-container>
  <p class="title">TRANSCENDENCE</p>
  <p class="subtitle">elevate your game to transcendental mastery.</p>
</div>


<style>
  .title-container {
    position: sticky;
    text-align: center;
    /* width: 100vw; Utilisez 100vw pour occuper toute la largeur de la fenêtre */
    opacity: 0.6;
    color: white;
    clear: both;
    margin-top: 15%;
  }
  
  .title {
    font-family: "Doctor Glitch";
    font-size: 5vw; /* Ajustez la taille de police selon vos besoins*/
    margin: 0; /* Supprimez les marges par défaut du paragraphe */
    padding: 0; /* Supprimez les rembourrages par défaut du paragraphe */
  }

  .subtitle {
    font-size: 2vw;
    font-family: sans-serif;
  }

  @media (max-width: 768px) {

    .title-container {
      text-align: center;
      margin: 50% auto;
    }

    .title-container .title {
      font-size: 8vw;
    }

    .subtitle {
    font-size: 3vw;
    font-family: sans-serif;
    }
  }

  </style>