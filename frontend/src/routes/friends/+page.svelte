<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

    import socket from "../../socket";
	import { userData } from "$lib/stores/userDataStore";
    import { twoFaLocked } from "$lib/stores/twoFaLockedState";
    import GameInvitePopup from "$lib/chat/GameInvitePopup.svelte";

    let showPopup: boolean = false;
    let inviter: string = "";
    
    let requests: string[] = [];

    let friendsList: Map<string, string> = new Map<string, string>();

    onMount(() => {

        if ($twoFaLocked) {
			goto('/2fa');
			return;
		}

        socket.auth = { username: $userData.nickname };
        socket.connect();

        socket.on("new request", (data: string) => {
            // ajouter data au tableau
            requests = [ ...requests, data];
        });

        socket.on("friend list", (data) => {
            friendsList = new Map(data);
            // console.log("received friends list:", friendsList);
        });

        socket.on("pending requests", (data) => {
            requests = data;
        });

        socket.on("already friend", () => {
            alert("Error: This user is already your friend.");
        });

        socket.on("new friend", (data: any) => {

            const index = requests.indexOf(data.nickname);

            if (index !== -1) {
                requests.splice(index, 1)[0];
                requests = requests;
                friendsList.set(data.nickname, data.status);
                friendsList = friendsList;
            }
        });

        socket.on("Internal error", (data) => {
            alert("Internal error. Please try again later.");
        });

        socket.on("successfully declined", (data: string) => {
            alert("Request declined.");
            const index = requests.indexOf(data);

            if (index !== -1) {
                requests.splice(index, 1)[0];
                requests = requests;
                friendsList.set(data, data);
                friendsList = friendsList;
            }
        });

        socket.on("game invite", (data: string) => {
            inviter = data;
            showPopup = true;
        });

        socket.emit("getFriendsList", $userData);
        socket.emit("getFriendRequests", $userData);
    });

    async function acceptRequest(friend: string)
    {
        let content: any = {
            target: friend,
            userData: $userData
        };
        console.log("Accepting request from", content.target);
        socket.emit("acceptRequest", content);
    }

    async function declineRequest(friend: string)
    {
        console.log("Declining", friend, "'s request");
        let content: any = {
            target: friend,
            userData: $userData
        };
        socket.emit("declineRequest", content);
    }

</script>

<div class="container">
    <div class="requests-container">
        <div class="header">
            <h3>REQUESTS</h3>
        </div>
        <ul class="requests-list">
            {#if !requests || !requests[0]}
                <p class="empty-list">No requests</p>
            {:else}
                {#each requests as request}
                    <div class="request">
                        <li>
                            <p class="request-nickname">{request}</p>
                        </li>
                        <button class="accept-button" on:click={() => {acceptRequest(request)}}>accept</button>
                        <button class="decline-button" on:click={() => {declineRequest(request)}}>decline</button>
                    </div>
                {/each}
            {/if}
        </ul>
    </div>

    <div class="friends-container">
        <ul class="friends-list">
            {#if friendsList && friendsList?.entries !== undefined}
                {#each Array.from(friendsList.entries()) as [friend, status] (friend)}
                    <li class="friend">
                        <a class="friend-nickname" on:click={() => {
                            goto(`/profile?login=${friend}`);
                        }}>{friend}</a>
                        {#if status === "online"}
                            <div class="online-symbol"></div>
                        {:else if status === "offline"}
                            <div class="offline-symbol"></div>
                        {:else}
                            <p>IN A GAME</p>
                        {/if}
                    </li>
                    {/each}
                {:else}
                    <p class="empty-list">No friends yet.</p>
                {/if}
        </ul>
    </div>
</div>

{#if showPopup}
    <GameInvitePopup inviter={inviter} />
{/if}

<style>

    .container {
        display: flex;
        width: 50vw;
        height: auto;
        border: 1px solid black;
        margin-top: 3%;
        position: fixed;
        border-radius: 10px;
        margin: 5% 50%;
        transform: translateX(-50%);
    }

    .empty-list {
        text-align: center;
        margin-bottom: 15px;
        text-align: center;
    }
    
    /* REQUESTS LIST ZONE */

    .requests-container {
        width: 40%;
        height: 100%;
        border-right: 1px solid black;
        background-color: white;
        display: flex;
        flex-direction: column;
        font-family: Arial, Helvetica, sans-serif;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }

    .header {
        padding: 5%;
        height: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .requests-list {
        list-style-type: none;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        /* border: 1px solid red; */
        overflow-y: scroll;
    }
    
    .request {
        border-top: 1px solid black;
        border-radius: 10px;
        padding: 2%;
        margin-bottom: 5%;
    }

    .request:active {
        background-color: lightgray;
    }
    
    .request .request-nickname {
        flex-grow: 1;
        text-decoration: none;
        font-weight: bold;
        font-size: larger;
        margin-left:2%;
        margin-top: 2%;
        margin-bottom: 2%;
    }

    .request button {
        border-radius: 10px;
        padding: 2%;
        border: none;
        cursor: pointer;
    }

    .friends-container {
        display: flex;
        flex-direction: column;
        width: 60%;
        background-color: white;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        overflow-y: scroll;
    }

    .friends-container .friends-list {
        width: 100%;
        height: 85%;
        /* padding: 1%; */
    }
    
    .friend {
        padding: 3%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
    }

    .friend-nickname {
        cursor: pointer;
    }

    .online-symbol {
        background-color: green;
        height: 1rem;
        width: 1rem;
        border-radius: 50%;
    }

    .offline-symbol {
        background-color: red;
        height: 1rem;
        width: 1rem;
        border-radius: 50%;
    }

</style>