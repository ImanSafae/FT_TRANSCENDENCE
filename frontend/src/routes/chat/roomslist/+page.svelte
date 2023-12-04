<script lang="ts">
	import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    import socket from "../../../socket";
    import { userData } from "$lib/stores/userDataStore";
    import RoomPasswordPopup from "$lib/chat/RoomPasswordPopup.svelte";
    import RoomSelection from "$lib/chat/RoomSelection.svelte";
    import { twoFaLocked } from "$lib/stores/twoFaLockedState";
    import GameInvitePopup from "$lib/chat/GameInvitePopup.svelte";

    let roomSelected: string;
    let passwordRequired: boolean = false;
    let passwordVerified: boolean = false;

    let showPopup: boolean = false;
    let inviter: string = "";

    onMount(() => {
      if ($twoFaLocked) {
			  goto('/2fa');
			  return;
		  }
		socket.auth = { username:$userData.nickname };
        socket.connect();
        
        socket.on("game invite", (data: string) => {
            inviter = data;
            showPopup = true;
        });
    })
</script>

<RoomSelection bind:roomSelected={roomSelected} bind:passwordRequired={passwordRequired} />

<!-- {#if passwordRequired && !passwordVerified}
    <RoomPasswordPopup roomToCheck={roomSelected} bind:passwordVerified={passwordVerified}/>
{/if} -->

{#if showPopup}
    <GameInvitePopup inviter={inviter} />
{/if}