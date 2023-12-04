<script lang="ts">
    import GlitchyButton from "./GlitchyButton.svelte";

    import { userData } from "$lib/stores/userDataStore";
    import socket from "../../socket";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

    export let formCreated:boolean = false;

    export let roomName:string ="";
    export let roomCreationData: {
        roomName: string,
        password: string,
        privateStatus: boolean,
        userData: any
    };

    let password: string ="";
    let passwordShown: boolean = false;
    let privateChecked: boolean = false;

    onMount(() => {
        socket.on("room creation error", () => {
            alert("Internal error during room creation. Please try again later.");
        });

        socket.on("room creation success", () => {
            // console.log("roomm creation was a success!");
            // console.log("room", roomName, "was created");
            formCreated = true;
            const url: string = `chat/room?room=${roomName}`;
            goto(url);
        });

        socket.on("room already exists", () => {
            alert("A room by this name already exists. Try joining it or creating one with a new name instead");
        });

        socket.on("Internal error", () => {
            alert("Internal error. Please try again later.");
        });
    });

    function createRoom()
    {
        if (!roomName || roomName === "")
            return ;

        const statusChosen: boolean = privateChecked;
        console.log("Attempting to create room", roomName);
        roomCreationData = {
            roomName: roomName,
            password: password,
            privateStatus: statusChosen, // implémenter la possibilité de le set à true
            userData: $userData
        };
        console.log("Emitting socket event");
        socket.emit("createRoom", roomCreationData);
    }

    function togglePasswordDisplay()
    {
        passwordShown = !passwordShown;
    }

</script>

<div class="room-creation-container">
    <h1>Create a room</h1>
    <div class="room-form">
        <div class="room-name-input">
            <input type="text" placeholder="Room name" bind:value={roomName} id="room-name-input">
        </div>
        <!-- <div class="password">
            {#if passwordShown}
                <input type="text" placeholder="Room password (optional)" bind:value={password}/>
            {:else}
                <input type="password" placeholder="Room password (optional)" bind:value={password}/>
            {/if}
            <span class="eye-icon" role="button" tabindex="0" on:click={togglePasswordDisplay}>👁️</span>
        </div> -->
    </div>
    <!-- <div class="checkbox-div">
        <input type="checkbox" bind:value={privateChecked} id="checkbox"><label for="checkbox">Make room private (it won't appear in the list of available rooms)</label>
    </div> -->
    <GlitchyButton buttonText="CREATE A ROOM" on:click={createRoom} />
</div>

<style>
.room-creation-container {
        font-family: "Coolvetica";
        color: white;
        width: 50%;
        height: 50%;
        background-image: url("ffflurry.svg");
        margin: 10% auto;
        border-radius: 15px;
        opacity: 0.75;
        display: flex;
        /* justify-content: center; */
        padding: 20px 10px 20px 10px;
        flex-direction: column;
        align-items: center;
        row-gap: 10%;
        /* border: 3px solid yellow; */
    }

    .room-form {
        width: 100%;
        height: 30%;
        display:flex;
        flex-direction: column;
        /* justify-content: center; */
        align-items: center;
        row-gap: 10px;
        /* border: 3px solid red; */
    }
    
    .room-form .room-name-input {
        width: 70%;
        height: 50%;
        position: relative;
        display: flex;
    }
    .room-form input {
       flex-grow: 1;
        width: 100%;
        height: 100%;
        padding-left: 15px;
        border: none;
    }

    .room-form .password {
        width: 70%;
        height: 50%;
        position: relative;
        display: flex;
    }

    .eye-icon {
        position: absolute;
        top: 50%;
        right: 10px; /* Ajustez la position horizontale de l'icône */
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
    }

    .checkbox-div {
        /* border: 3px solid yellowgreen; */
        width: auto;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: row;
        column-gap: 10px;
    }
    
    .checkbox-div label {
        font-size: larger;
    }

</style>