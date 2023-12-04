<script lang="ts">
	import { goto } from "$app/navigation";


    import ChatInterface from "$lib/chat/ChatInterface.svelte";
	import GlitchyButton from "$lib/chat/GlitchyButton.svelte";
	import RoomCreationForm from "$lib/chat/RoomCreationForm.svelte";
	import PleaseLogin from "$lib/error/PleaseLogin.svelte";
    import GameInvitePopup from "$lib/chat/GameInvitePopup.svelte";

    import { loggedIn } from "$lib/stores/loggedStore";
    import { userData } from "$lib/stores/userDataStore";
    import { twoFaLocked } from "$lib/stores/twoFaLockedState";

	import { onMount } from "svelte";
	import socket from "../../socket";

    let showPopup: boolean = false;
    let inviter: string = "";

    let choiceMade:boolean = false;
    let onChat:boolean = false;
    let roomCreation:boolean = false;
    let privateMsgForm:boolean = false;

    let roomName: string="";

    let roomCreationData: {
        roomName: string,
        password: string,
        privateStatus: boolean,
        userData: any
    };

    function makeAChoice()
    {
        choiceMade = true;
    }

    onMount(() => {

        if ($twoFaLocked) {
			goto('/2fa');
			return;
		}
        socket.auth = { username: $userData.nickname };
        socket.connect();

        socket.on("game invite", (data: string) => {
            inviter = data;
            showPopup = true;
        })
    })

</script>

{#if !$loggedIn}
    <PleaseLogin />
{:else}
    {#if !choiceMade}
        <div class="room-or-dm-selection">
            <GlitchyButton buttonText="JOIN AN EXISTING ROOM" on:click={() => {
                goto("/chat/roomslist");
            }} />
            <GlitchyButton buttonText="CREATE A ROOM" on:click={() => {
                makeAChoice();
                roomCreation = true;
            }} />
            <GlitchyButton buttonText="PRIVATE MESSAGES"  on:click={() => {
                goto("/chat/dm");
            }}/>
            <GlitchyButton buttonText="SEE MY FRIENDS LIST & REQUESTS"  on:click={() => {
                goto("/friends");
            }}/>
        </div>
    {/if}

    {#if roomCreation  && !onChat}
        <RoomCreationForm bind:formCreated={onChat} bind:roomName={roomName} bind:roomCreationData={roomCreationData} />
    <!-- {:else if onChat}
        <ChatInterface roomName={roomName} roomCreationData={roomCreationData}/> -->
        <!-- METTRE CA DANS UNE PAGE CHAT/ROOM PLUTÔT -->
    {/if}
{/if}

{#if showPopup}
    <GameInvitePopup inviter={inviter} />
{/if}

<style>
    .room-or-dm-selection {
        margin: 15% auto;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        width: 30%;
    }
</style>
