<script lang="ts">

    // TOUT CE QUE CETTE PAGE DOIT FAIRE C RECUPERER LES INFOS DE LA ROOM DONNEE EN PARAMETRE
    // VERIFIER QUE LE USER EST BIEN DEDANS (c le back qui vérifie et qui enverra les infos si et seulement
    // si le user est bien dedans)
    // ET LES AFFICHER
    // SI ELLE NE RECOIT PAS LES INFOS C QUE LE USER EST PAS DEDANS -> MESSAGE D'ERREUR -> REDIRECTION
    // VERS LA PAGE PRECEDENTE
    // LE PROCESS EST LE MEME QU'IL S'AGISSE D'UNE NOUVELLE ROOM OU D'UNE REJOINTE

	import { goto } from "$app/navigation";
    import { onMount } from "svelte";

	import ChatInterface from "$lib/chat/ChatInterface.svelte";
	import RoomPasswordPopup from "$lib/chat/RoomPasswordPopup.svelte";
    import { Room } from "$lib/chat/RoomClass";
    import socket from "../../../socket";
    import { userData } from "$lib/stores/userDataStore";
    import { twoFaLocked } from "$lib/stores/twoFaLockedState";
	import GameInvitePopup from "$lib/chat/GameInvitePopup.svelte";

    let roomName: string = "";
    let password: string = "";
    let roomData: Room;

    let newRoom: boolean;
    let userInRoom: boolean;

    let showPopup: boolean = false;
    let inviter: string = "";

    let accessGranted: boolean = false;
    // devient true une fois qu'on a vérifié que la room n'est pas protégée ou, si elle l'est, que le mdp a été validé
    // AVANT TOUTE CHOSE ON VERIFIE SI LE USER N'EST PAS DEJA DEDANS -> AUQUEL CAS NUL BESOIN DE + DE VERIFICATIONS
    let passwordPopup: boolean = false;
    let passwordVerified: boolean = false;
    // on échange le mdp contre le contenu de la room auprès du back

    async function fetchData()
    {
        // On récupère le nom de la room donné en paramètre
        let params = new URLSearchParams(window?.location?.search);
		let room: string | null = params.get('room');
        // Si pas de room en param -> on part 
        if (!room || room === "")
        {
            goto("/chat/roomslist");
            return ;
        }
        roomName = room;

        // On récup les infos de la room en question en vérifiant qu'elle existe et que le user est bien dedans
        let dataToEmit: any = {
            roomName: roomName,
            userData: $userData
        };
        socket.emit("displayRoom", dataToEmit);
    }

    onMount(async () => {

        if ($twoFaLocked) {
			goto('/2fa');
			return;
		}

        socket.on("room content", (roomContent: any) => {
            console.log("received content from backend:", roomContent);
            const privateStatus: boolean = roomContent.private;
            const pwd: string = roomContent.password;

            let protectedStatus: boolean = roomContent.protected;

            let owned: boolean = false;
            if (roomContent.owner === $userData.nickname)
                owned = true;

            roomData = new Room(roomName, privateStatus, owned);

            roomData.messages = roomContent.messages;
            roomData.isProtected = protectedStatus;

            let users: {
                nickname: string,
                visibleInteractions: boolean
            }[] = [];

            roomContent.userList.forEach((user: string) => {
                const newUser: any = {
                    nickname: user,
                    visibleInteractions: false
                };
                users.push(newUser);
            });
            roomData.users = users;

            if (roomContent.adminList.includes($userData.nickname))
                roomData.admined = true;

            accessGranted = true;
            roomData = roomData;
            console.log("Parsed Room Data Object:", roomData);
        });

        socket.on("Internal error", () => {
            alert("Internal error. Please try again later.");
            goto("/chat");
        });

        socket.on("room not found", () => {
            alert("Requested room doesn't exist.");
            goto("/chat");
        });

        socket.on("not allowed", () => {
            alert("You don't have the rights to access this room.");
            goto("/chat");
        });

        socket.on("game invite", (data: string) => {
            inviter = data;
            showPopup = true;
        })
        await fetchData();
    })

</script>

{#if accessGranted}
    <ChatInterface bind:roomData={roomData} />
{/if}

{#if showPopup}
    <GameInvitePopup inviter={inviter} />
{/if}