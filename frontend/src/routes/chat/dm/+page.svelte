<script lang="ts">
	import DmInterface from "$lib/chat/DmInterface.svelte";
	import { twoFaLocked } from "$lib/stores/twoFaLockedState";
	import socket from "../../../socket";
	import GameInvitePopup from "$lib/chat/GameInvitePopup.svelte";

	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	let showPopup: boolean = false;
    let inviter: string = "";

	onMount(() => {
		if ($twoFaLocked) {
			goto('/2fa');
			return;
		}

		socket.on("game invite", (data: string) => {
            inviter = data;
			showPopup = true;
        });
	});
</script>

<div class="dm-interface">
	<DmInterface />
</div>

{#if showPopup}
    <GameInvitePopup inviter={inviter} />
{/if}