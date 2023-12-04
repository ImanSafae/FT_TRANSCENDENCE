<script lang="ts">
    
    import { logOut } from "./Auth.svelte";
    import { loggedIn } from "../stores/loggedStore";

    let loginPage: string = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0c5d0153eee0509ce923228ecef6e8ebb0cfb2e2fe4ab50b6bdc528d6a86dd21&redirect_uri=http%3A%2F%2F159.65.54.159%3A5173&response_type=code";
    </script>

<div class="navbar">
    <nav>
        <a href="/game">PLAY PONG</a>
        <!-- <a href='#'>LEADERBOARD</a> -->
        <a href="/chat">CHAT</a>
        {#if !$loggedIn}
            <a href={loginPage}>LOG IN</a>
        {:else}
            <a href="/profile">PROFILE</a>
            <a href="/" on:click={logOut}>LOG OUT</a>
        {/if}
    </nav>
</div>




<style>
.navbar {
    top: 20px;
    left:0;
    /* padding: 10px; */
    position: sticky;
    
}
.navbar nav {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    background-color: #000000;
    opacity: 0.5;
    padding: 25px 0px 25px 0px;
}
.navbar nav a 
{
    font-family: "Astral Delight";
    font-size: 1.5vw;
    color: white;
    text-decoration: none;
}

@media (max-width: 768px) {

    .navbar nav {
        height: 5vh;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        opacity: 0.5;
    }

    .navbar nav a {
        font-size: 3vw;
    }
}

</style>