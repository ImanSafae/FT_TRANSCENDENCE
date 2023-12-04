<script lang="ts">
	import { onMount } from "svelte";
    import { goto } from "$app/navigation";

	import { userData } from "$lib/stores/userDataStore";
	import socket from "../../socket";

    let hostname;
	if (import.meta.env.SSR === false) {
      hostname = location.hostname;
    }

    let passwordVerificationEndpoint: string = `http://${hostname}:3000/verifypassword`;

    export let roomToCheck: string;
    export let passwordVerified: boolean = false;

    let password: string = "";
    let passwordShown: boolean = false;
    let wrongPasswordMessage: boolean = false;

    onMount(() => {
        // socket.on("wrong password", () => {
        //     alert("Wrong password.");
        // });

        socket.on("Internal error", () => {
            alert("Internal error. Please try again later.");
        });

        // socket.on("banned from room", () => {
        //     alert("You are banned from joining this room.");
        // });
        
        socket.on("Join success", () => {
            passwordVerified == true;
            goto("/chat/room" + "?room=" + roomToCheck);
        });

        socket.on("room not found", () => {
            alert("Room not found.");
        });
    })

    function togglePasswordVisibility()
    {
        passwordShown = !passwordShown;
    }

    async function sendPassword()
    {
        if (!password || password == "")
            return ;
        let dataToSend: any = {
            roomName: roomToCheck,
            password: password,
            userData: $userData
        };
        socket.emit("joinRoom", dataToSend);
    }

</script>


<div class="wrapper">
    <div class="password-box">
        <h3>This room is private. Enter password:</h3>
        <div class="password-input">
            {#if !passwordShown}
                <input class="password-input-box" type="password" bind:value={password}>
            {:else}
                <input class="password-input-box" type="text" bind:value={password}>
            {/if}
            <span class="eye-icon" role="button" tabindex="0" on:click={togglePasswordVisibility}>👁️</span>
        </div>
        <button on:click={sendPassword}>SUBMIT</button>
        <img class="lock-img" src="/lock.png" alt="locked padlock">
        {#if wrongPasswordMessage}
            <p style="color:red">Wrong password. Please try again.</p>
        {/if}
    </div>
</div>

<style>
    .wrapper{
        font-family: "Coolvetica";
        background-color: rgba(255,255,255,0.6);
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 100;
        overflow: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }

    .password-box{
        background-color: #e6e2ef;
        width: 40%;
        height: 40%;
        border-radius: 5%;
        border: 1px solid gray;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        /* row-gap: 15%; */
        padding: 3%;
    }

    .password-box h3 {
        /* margin-top: 15%; */
        margin-bottom: 5%;
    }
    .password-box button {
        margin-bottom: 5%;
        width: 15%;
        height: 10%;
        border:none;
        border-radius: 10%;
        cursor:pointer;
    }

    .password-input {
        position: relative;
        height: 15%;
        margin-bottom: 2%;
    }

    .password-input-box {
        /* flex-grow: 1; */
        width: 100%;
        height: 100%;
        border: none;
        margin: 0;
        padding-left: 15px;
    }

    .eye-icon {
        position: absolute;
        top: 50%;
        right: 2%; /* Ajustez la position horizontale de l'icône */
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
    }

    .lock-img {
        width: 10%;
    }

</style>