<script lang="ts">

	// CE COMPOSANT A POUR SEUL ROLE D'AFFICHER LES INFOS RECUES SUR LA ROOM
	// TANT QU'IL N'Y A PAS D'INFO RECUE, LA FENETRE EST VIERGE

	import { onMount } from "svelte";
	// import { io } from "socket.io-client";
	import { goto } from "$app/navigation";

	import { userData } from "$lib/stores/userDataStore";
	import type { MessageDto } from "$lib/dto/models.dto";
	import socket from "../../socket";
	import type { Room } from "./RoomClass";

	export let roomData: Room;
    let roomName:string = roomData.roomName;

	let hostname;
	if (import.meta.env.SSR === false) {
      hostname = location.hostname;
    }

	// const settingsIcon: string = "/settings.svg";
	const blockEndpoint: string = `http://${hostname}:3000/user/block`;

	let visibleSettings: boolean = false;
	let usersShown: boolean = false;
	let roomOwner: boolean = roomData.owned;
	let roomAdmin: boolean = roomData.admined;
	// let usersInteractionsShown: boolean = false;

	let newPassword: string = "";
	let message:string = "";
	let chatText:string = "";

	let chatMessages: any[] = roomData.messages;
	let usersList: any[] = roomData.users;
	

	onMount(() => {
		
		// socket.on("disconnect", () => {
			// 	console.log("Disconnected from WebSocket");
			// });
		// usersList.forEach((user) => {
		// 	user.visibleInteractions = false;
		// });
		// console.log("chatMessages:", chatMessages);
		// console.log("usersList:", usersList);
		socket.on("room message", (message: MessageDto) => {
			let blocked: boolean = false;
			$userData.blocklist.forEach((blockedUser: string) => {
				if (blockedUser === message.user)
				{
					blocked = true;
					return ;
				}
			});
			if (blocked)
				return ;
			const newMessage: any = {
				sender: message.user,
				msg: message.message,
				roomName: roomName,
				id: undefined,
				room: undefined
			};
			chatMessages = [...chatMessages, newMessage];
		});
		
		socket.on("new connection", (info: string) =>
		{
			const newMessage: any = {
				id: undefined,
				sender: "",
				msg: info,
				room: undefined,
				roomName: roomName
			};
			chatMessages = [...chatMessages, newMessage];
		});


		// socket.on("password change", (success) => {
		// 	visibleSettings = false;
		// 	if (success === true)
		// 	{
		// 		alert("Password successfully changed!");
		// 	}
		// 	else {
		// 		alert("Error. Please try again later.");
		// 	}
		// });

		// socket.on("toggle room private", (success) => {
		// 	if (success === true)
		// 	{
		// 		alert("Room status changed");
		// 		visibleSettings = false;
		// 		roomData.isProtected = !roomData.isProtected;
		// 	}
		// 	else {
		// 		alert("Error. Please try again later.");
		// 	}
		// });

		socket.on("already blocked", () => {
			alert("This user is already blocked.");
		});

		socket.on("successfully blocked", (target: string) => {
			// $userData.blocklist = [ ...$userData.blocklist, target];
			// $userData.blocklist.push(target);
			userData.update((data: any) => {
				const updatedBlocklist = [ ...data.blocklist, target];
				return {
					...data,
					blocklist: updatedBlocklist
				};
			});
			$userData.blocklist = $userData.blocklist;
			console.log("blocked users:", $userData.blocklist);
			alert("Successfully blocked.");
		});

		socket.on("not allowed", () => {
			alert("You don't have the required rights to do this.");
		});

		socket.on("message sent", (data: any) => {
			const newMessage: any = {
			sender: $userData.nickname,
			msg: data.message,
			roomName: roomName,
			id: undefined,
			room: undefined
		};
		chatMessages = [...chatMessages, newMessage];
		message = "";
		});

		// socket.on("Internal error", () => {
		// 	console.log("Internal error. Please try again later.");
		// 	message = "";
		// });

		socket.on("not in room", () => {
			alert("You are not in this room.");
			goto("/chat");
		});

		socket.on("no such room", () => {
			alert("Error: this room was deleted.");
			goto("/chat");
		});

		socket.on("new user", (newUser: any) => {
			let found: boolean = false;
			usersList.forEach((user) => {
				if (user.nickname === newUser)
				{
					found = true;
					return ;
				}
			});
			if (found)
				return ;
			usersList.push({
				nickname: newUser,
				visibleInteractions: false
			});
			usersList = usersList;
		});
	});

	function sendMessage() // fonctions db pas encore faites
	{
		if (message === "")
			return ;
		const dataToSend = {
			roomName: roomName,
			message: message,
			userData: $userData
		};

		socket.emit("roomMessage", dataToSend);
	}

	function sendWithEnter(event: KeyboardEvent)
	{
		if (event.key === "Enter")
		{
			event.preventDefault();
			sendMessage();
		}
	}

	function toggleUsersList() {
		usersShown = !usersShown;
	}

	function openProfile(event: MouseEvent)
	{
		const clickedName = event.target as HTMLElement;
		const profileToOpen = "?login=" + clickedName.innerText;
		console.log("trying to go to " + profileToOpen);
		goto("/profile" + profileToOpen);
	}

	function toggleSettings()
	{
		visibleSettings = !visibleSettings;
	}

	function toggleUsersInteractions(user: any)
	{
		const updatedUser = { ...user, visibleInteractions: !user.visibleInteractions };
		usersList = usersList.map(u => (u.nickname === user.nickname ? updatedUser : u));
	}

	async function blockUser(target: any) {
		const content: any = {
			target: target.nickname,
			userData: $userData
		};

        try {
			console.log("Attempting to block", target.nickname);
			socket.emit("block", content);
        }
        catch (err)
        {
            console.log("error:", err);
        }
	}

	// function banUser(user: any)
	// {
	// 	if (!roomOwner && !roomAdmin)
	// 		return ;

	// 	const target: string = user.nickname;
	// 	const data: any = {
	// 		target: target,
	// 		roomName: roomName,
	// 		userData: $userData
	// 	};
	// 	socket.emit("banUser", data);	
	// }

	// function kickUser(user: any)
	// {
	// 	if (!roomOwner && !roomAdmin)
	// 		return ;

	// 	const target: string = user.nickname;
	// 	const data: any = {
	// 		target: target,
	// 		roomName: roomName,
	// 		userData: $userData
	// 	};
	// 	socket.emit("kickUser", data);	
	// }

	// function giveAdminRights(user: any)
	// {
	// 	if (!roomOwner && !roomAdmin)
	// 		return ;
	// 	const target: string = user.nickname;
	// 	const data: any = {
	// 		target: target,
	// 		roomName: roomName,
	// 		userData: $userData
	// 	};
	// 	socket.emit("giveAdminRights", data);
	// }


	// function sendNewPassword()
	// {
	// 	if (newPassword === "" || !roomOwner)
	// 		return ;

	// 	let content: any = {
	// 		roomName: roomName,
	// 		password: newPassword,
	// 		userData: $userData
	// 	};
	// 	socket.emit("newRoomPassword", content);
	// }

	// function deletePassword(user: any)
	// {
	// 	if (!roomOwner)
	// 		return ;

	// 	let content: any = {
	// 		roomName: roomName,
	// 		password: newPassword,
	// 		userData: $userData
	// 	};

	// 	socket.emit("deletePassword", content);
	// }

	// function toggleRoomPrivate(user: any)
	// {
	// 	if (!roomOwner)
	// 		return ;

	// 	let content: any = {
	// 		roomName: roomName,
	// 		userData: $userData
	// 	};
	// 	socket.emit("toggleRoomPrivate", content);
	// }

	function inviteToGame(user: any)
	{
		const target: string = user.nickname;
		const content: any = {
			target: target,
			userData: $userData
		};

		socket.emit("inviteToGame", content);
		goto("/pong");
	}

</script>


<div class="chat-container">
	<div class="title-box">
		<h1 class="room-name">{roomName}</h1>
		<div class="settings-area">
			<!-- {#if roomOwner}
				<img class="settings-icon" src={settingsIcon} alt="settings icon" on:click={toggleSettings}>
			{/if} -->
			<div class="settings-area-bottom">
				{#if roomOwner && visibleSettings}
				<div class="settings-window">
					{#if roomData.isProtected}
						<div class="password-change">
							<!-- <h3>CHANGE PASSWORD</h3> -->
							<!-- <input type="text" placeholder="new password" bind:value={newPassword}> -->
							<!-- <button on:click={sendNewPassword}>SEND</button> -->
						</div>
						<div class="password-deletion">
							<!-- <h3><a href="#" on:click={deletePassword}>DELETE PASSWORD</a></h3><p>this room won't be protected by a password anymore and anyone will be able to join.</p> -->
						</div>
					{/if}
					<div class="room-privatisation">
						<!-- <h3><a href="#" on:click={toggleRoomPrivate}>MAKE ROOM PRIVATE</a></h3><p>this room won't show up in the list of existing rooms but users will still be able to find it if they have its name.</p> -->
					</div>
				</div>
				{/if}
				<span class="show-users-button" on:click={toggleUsersList}>users in this room</span>
			</div>
		</div>
	</div>
	<div class="textbox">
		<ul class="message-list">
			{#each chatMessages as msg, msgIndex (msgIndex)}
				{#if msg.sender}
					{#if !(($userData.blocklist)?.includes(msg.sender))}
						<li class="message-line"><a href="#" class="user-link" on:click={openProfile}>{msg.sender}</a>: {msg.msg}</li>
					{/if}
				{:else}
					<li class="new-connection">{msg.msg}</li>
				{/if}
			{/each}
		  </ul>
		  {#if usersShown}
		  <div class="connected-users-container">
			  <ul>  
				{#each usersList as user}
					<div class="user-line">
						<li on:click={openProfile}>{user.nickname}</li>
						{#if user.nickname !== $userData.nickname}
							<div class="user-line-right-handside">
								<img class="three-dots-img" src="/three-dots.svg" alt="Click to unroll user interactions" on:click={() => {toggleUsersInteractions(user)}}>
								{#if user.visibleInteractions}
								<div class="user-interactions">
									<a href="#" on:click={() => {blockUser(user)}} style="color:red">block</a>
									<a href="#" on:click={() => {inviteToGame(user)}}>Invite to a Pong game</a>
									<!-- {#if roomAdmin}
										<a href="#" on:click={() => {banUser(user)}}>ban</a>
										<a href="#" on:click={() => {kickUser(user)}}>kick</a>
									{/if}
									{#if roomOwner}
										<a href="#" on:click={() => {giveAdminRights(user)}}>give admin rights</a>
									{/if} -->
								</div>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			  </ul>
		</div>
		{/if}
	</div>
	<div class="input-bar">
			<textarea class="message" placeholder="Send message" bind:value={message} on:keydown={sendWithEnter}></textarea>
			<button on:click={sendMessage}>SEND</button>
	</div>
</div>

<style>
	.chat-container {
        font-family: "Coolvetica";
		background-color:black;
        background-image: url("ffflurry.svg");
		width:95%;
		height:80vh;
		margin: 2% auto;
		display:flex;
		justify-content: center;
		align-items: center;
		padding:10px;
		flex-direction: column;
		row-gap:1px;
        z-index: 1;
		/* position:fixed; */
	}
	.title-box {
		width:100%;
		background-color: white;
		/* height: 5%; */
		padding:10px 0px 10px 0px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		position: relative;
		text-align: center;
		
	}
	
	.title-box h1 {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	.settings-area {
		height: 100%;
		width: 15%;
		/* border: 1px solid green; */
		margin-left: auto;
		z-index: 5;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		row-gap: 10px;
	}

	.settings-icon {
		cursor: pointer;
		width: 10%;
		/* right: 15%; */
		margin-right: 10%;
	}
	
	.settings-area-bottom {
		position: relative;
		/* border: 1px solid orangered; */
	}
	
	.settings-area-bottom .settings-window { /* <-------------- ICI <---------------------- */
		height: 30vh;
		width: 15vw;
		border: 1px solid black;
		background-color: white;
		position: absolute;
		top: 2%;
		right: 2%;
		padding: 10%;
		text-align: left;
		display: flex;
		flex-direction: column;
		overflow: scroll;
		row-gap: 10px;
	}

	.settings-area-bottom .settings-window input {
		padding: 1% 0% 1% 1%;
		width: 50%;
	}

	.settings-area-bottom .settings-window button {
		width: 30%;
		padding: 1%;
	}

	.settings-area-bottom .settings-window p {
		font-family: Arial, Helvetica, sans-serif;
		font-size: smaller;
	}

	.settings-area-bottom .settings-window h3 {
		margin-bottom: 1%;
		font-weight: lighter;
	}

	.show-users-button {
		right: 15%;
		margin-right: 2%;
		cursor: pointer;
		text-decoration: underline;
	}

	.show-users-button:hover {
		font-weight: bold;
	}


	.textbox {
		background-color:white;
		width:100%;
		height:100%;
		opacity:0.95;
		/* padding:15px; */
		box-sizing: border-box; 
		overflow: auto;
		display:flex;
		flex-direction: row;
		/* border: 2px solid green; */
	}

	.input-bar {
		width:100%;
		height:auto;
		display:flex;
		
	}
	.input-bar textarea {
		width: 100%;
		height: 20px;
		resize:none;
		padding:20px;
	}

    .input-bar button {
        padding: 20px;
		z-index: 2;
    }

	.message-list {
		list-style: none;
		width: 80%;
		/* border: 1px solid red; */
		padding:15px;
	}

	.message-line {
		font-size: 20px;
	}

	.user-link {
		color: black;
		text-decoration: underline;
		cursor: pointer;
	}


	.connected-users-container {
		border-left: 1px solid black;
		width: 20%;
		height: 100%;
		overflow: scroll;
		/* background-color: rgba(0,0,0,0.5); */
	}
	
	.connected-users-container ul {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	
	/* .connected-users-container ul li {
	} */
	
	.connected-users-container .user-line {
		padding:10px;
		/* flex-grow: 1; */
		height: auto;
		display: flex;
		border: 1px solid black;
		display: flex;
		justify-content: space-between;
		/* align-items: flex-start; */
	}
	
	.connected-users-container .user-line li {
		
		cursor: pointer;
	}

	.user-line-right-handside {
		/* border: 1px solid pink; */
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		position: relative;
	}

	.three-dots-img {
		width: 10%;
		margin-bottom: 5%;
		cursor: pointer;
	}

	.user-interactions {
		border: 1px solid black;
		background-color: white;
		position: absolute;
		display: flex;
		flex-direction: column;
		height: auto;
		width: auto;
		overflow: visible;
		z-index: 100;
		right: 0;
		top: 80%;
		row-gap: 0.5vh;
		padding: 3% 10% 3% 10%;
		align-items: flex-end;
		font-family: Arial, Helvetica, sans-serif;
	}
</style>
