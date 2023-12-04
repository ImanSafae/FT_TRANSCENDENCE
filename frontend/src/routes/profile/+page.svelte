<script lang="ts">
	import { loggedIn } from '$lib/stores/loggedStore';
	import { userData } from '$lib/stores/userDataStore';
	import { twoFaLocked } from '$lib/stores/twoFaLockedState';
	import socket from '../../socket';
	
	import { error } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	import Navbar from '$lib/home/Navbar.svelte';
	import Auth, { logIn } from '$lib/home/Auth.svelte';
	import TwoFa from '$lib/twoFA/TwoFa.svelte';
	import Profile from '$lib/profile/Profile.svelte';
	import UserForm from '$lib/profile/UserForm.svelte';
	import PleaseLogin from '$lib/error/PleaseLogin.svelte';


	let hostname;
	if (import.meta.env.SSR === false) {
      hostname = location.hostname;
    }
	const blockEndpoint: string = `http://${hostname}:3000/user/block`;
	const userInfoEndpoint: string = `http://${hostname}:3000/user/info`;
	
	let myProfile: boolean = false;
	let blockedUser: boolean = false;

	let userInfo: any = [];

	let isFriend: boolean = false;

	let gameHistory: any[] = [];
// 	[{
// 		id:0,
// 		user1Id:2,
// 		user2Id:1,
// 		winnerId:2,
// 		u1Score:10,
// 		u2Score:7,
// 		createdAt: "2023-11-08T10:30:00.000Z",
// 		date: {}
// 	},
// 	{
// 		id:1,
// 		user1Id:2,
// 		user2Id:1,
// 		winnerId:1,
// 		u1Score:6,
// 		u2Score:10,
// 		createdAt: "2023-11-08T10:30:00.000Z",
// 		date: {}
// 	},
// ];

	let wins: number = 0;
	let losses: number = 0;

	async function loadData() {
		let params = new URLSearchParams(window?.location?.search);
		let login: string | null = params.get('login');
		if (!login || (login === $userData.nickname))
    	{
			myProfile = true;
			return;
		}
		if ($userData.blocklist.includes(login))
			blockedUser = true;

		let data = await fetch(userInfoEndpoint + `?nickname=${login}`, {
			method: "GET",
			headers: {
				"Content-type":"application/json"
			}, 
		});
		if (data.ok)
		{
			let info = await data.json();
			if (info === 404)
			{
				alert("User not found.");
				myProfile = true;
				return ;
			}
			if (info === 500)
			{
				alert("Internal error. Please try again later.");
				myProfile = true;
				return ;
			}
			userInfo = info;
			socket.emit("checkFriendship", {
				target: login,
				userData: $userData
			});

		}
	}
	
	onMount(async () => {
		
		if ($twoFaLocked) {
			goto('/2fa');
			return;
		}
		socket.auth = { username: $userData.nickname };
		socket.connect();
		
		
		socket.on("game history", (data: any) => {
			console.log("received game history:", data);
			
			// let i = 0;
			let profileToCheck = $userData;
			if (!myProfile)
			profileToCheck = userInfo;
		
		data.forEach((game: any) => {
			if (game.winnerId === profileToCheck.id)
			wins++;
		else
		losses++;
	
	const createdAtDate = game.createdAt instanceof Date ? game.createdAt : new Date(game.createdAt);
	let formattedDate = createdAtDate.toLocaleDateString('fr-FR', { 
		year: 'numeric', 
		month: '2-digit', 
		day: '2-digit'
	});
	game.date = formattedDate;
	gameHistory.push(game);
});
gameHistory = gameHistory;
});

socket.on("friendship status", (status) => {
	if (status === true)
	isFriend = true;
});

await loadData();

let nicknameToCheck: string;
if (!myProfile)
	nicknameToCheck =  userInfo.nickname;
else
	nicknameToCheck =  $userData.nickname;
console.log("nicknameToCheck:", nicknameToCheck);
socket.emit("getGameHistory", nicknameToCheck);
		socket.on("already blocked", () => {
				alert("This user is already blocked.");
			});

		socket.on("successfully blocked", () => {
			$userData.blocklist.push(userInfo.nickname);
			$userData.blocklist = $userData.blocklist;
			blockedUser = true;
			alert("Successfully blocked.");
		});

		socket.on("successfully unblocked", () => {
			const index = $userData.blocklist.indexOf(userInfo.nickname);
			if (index !== -1) {
				$userData.blocklist.splice(index, 1);
				blockedUser = false;
			}
			alert("Successfully unblocked.");
		});

		socket.on("successfully requested", () => {
			alert("Friend request sent.");
		});

		socket.on("already requested", () => {
			alert("You already sent a friend request to this person.");
		});

		socket.on("Internal error", () => {
			alert("Internal error. Please try again later.");
			goto("/");
		});

	});

	async function blockorUnblockUser() {
		
		try {
			const content: any = {
				target: userInfo.nickname,
				userData: $userData
			};
			if (!blockedUser)
				socket.emit("block", content);
			else {
				socket.emit("unblock", content);
				console.log("Attempting to unblock", content.target);
			}
		}
        catch (err)
        {
            console.log("error:", err);
        }
	}

	async function addFriend()
	{
		const content: any = {
			target: userInfo?.nickname,
			userData: $userData
		};

		try {
			console.log("Sending friend request to", content.target);
			socket.emit("addFriend", content);
		}
		catch (err)
        {
            console.log("error:", err);
        }
	}

</script>

{#if $loggedIn}

	{#if myProfile}
		<div class="main-container">
			<div class="left-handside">
				<div class="profile-component">
					<Profile wins={wins} losses={losses}/>
				</div>
				<div class="settings">
					<TwoFa />
					<UserForm />
				</div>
			</div>
			<div class="game-history">
				<div class="history-title"><h1>GAME HISTORY</h1></div>
				<div class="history-list">
					<ul>
						{#each gameHistory as game}
						<div>
							<li class="game">
								{#if game.winnerId === $userData.id}
								<span class="result">VICTORY</span>
								<div class="scores">
									<span class="my-score" style="color:green">{game.u1Score > game.u2Score ? game.u1Score : game.u2Score}</span>
									<span class="opp-score"> - {game.u1Score < game.u2Score ? game.u1Score : game.u2Score}</span>
								</div>
								{:else}
								<span class="result">LOSS</span>
								<div class="scores">
									<span class="my-score" style="color:red">{game.u1Score < game.u2Score ? game.u1Score : game.u2Score}</span>
									<span class="opp-score"> - {game.u1Score > game.u2Score ? game.u1Score : game.u2Score}</span>
								</div>
								{/if}
								<span class="date">{game.date}</span>
							</li>
						</div>
						{/each}
					</ul>
				</div>
			</div>
		</div>

	{:else}

		<div class="main-container">
			<div class="left-handside">
				<div class="profile-container">
					<div class="user-info">
						<img src={userInfo?.imageUrl} class="profilePic" alt="This is you!">
						<div class="user-description">
							<h2>Welcome to {userInfo?.nickname}'s profile!</h2>
							<h3>alias {userInfo?.fullName}</h3>
							<br />
							<div class="game-stats">
								<h2 style="text-align:center">Games played</h2>
								<h3>Victories: {wins}</h3>
								<h3>Losses: {losses}</h3>
							</div>
						</div>
					</div>
				</div>
				<div class="interactions">
					{#if !blockedUser}
						<!-- <button>Send a private message</button> -->
						<!-- <button>Challenge to a transcending Pong game</button> -->
						{#if !isFriend}
							<button on:click={addFriend}>Send a friend request</button>
						{/if}
					{/if}
					<button on:click={blockorUnblockUser}>
						{#if !blockedUser}Block this user
						{:else}Unblock this user
						{/if}
					</button>
				</div>
			</div>
			<div class="game-history">
				<div class="history-title"><h1>GAME HISTORY</h1></div>
				<div class="history-list">
					<ul>
						{#each gameHistory as game}
						<div>
							<li class="game">
								{#if game.winnerId === userInfo.id}
									<span class="result">VICTORY</span>
									<div class="scores">
										<span class="my-score" style="color:green">{game.u1Score > game.u2Score ? game.u1Score : game.u2Score}</span>
										<span class="opp-score"> - {game.u1Score < game.u2Score ? game.u1Score : game.u2Score}</span>
									</div>
								{:else}
									<span class="result">LOSS</span>
									<div class="scores">
										<span class="my-score" style="color:red">{game.u1Score < game.u2Score ? game.u1Score : game.u2Score}</span>
										<span class="opp-score"> - {game.u1Score > game.u2Score ? game.u1Score : game.u2Score}</span>
									</div>
									{/if}
								<span class="date">{game.date}</span>
							</li>
						</div>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<PleaseLogin />
{/if}

<style>

	.settings {
		/* width: 30%; */

		height: 120px;
		width: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		/* border: 7px solid lightsalmon; */
		align-items: center;
		margin-bottom: 10%;
	}
	
	
	.main-container {
		/* border:15px solid red; */
		margin-top: 5%;
		display: flex;
		flex-direction: row;
		
	}

	.left-handside {
		/* border:15px solid yellow; */
		width: 20%;
		display: flex;
		flex-direction: column;
		row-gap: 30px;
		left: 0;
		align-items: center;
	}

	.profile-container {
		width: auto;
		height: auto;
		border: solid 7px palevioletred;
		border-radius: 10px;
		font-family: 'Coolvetica';
		display: flex;
		flex-direction: column;
		justify-content: center;
		background-image: url('ffflurry.svg');
		background-size: cover;
		background-repeat: no-repeat;
		-webkit-text-fill-color: white;
		-webkit-text-stroke: 0.8px black;
		padding: 2%;
		text-align: center;
		padding-bottom: 20%;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		/* position:absolute; */
		width: auto;
		height: 400px;
		color: white;
		align-items: center;
		row-gap: 20px;
	}

	.user-description {
		display: flex;
		flex-direction: column;
		row-gap: 10px;
	}

	.interactions {
		height: 120px;
		width: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		/* border: 7px solid lightsalmon; */
		margin-bottom: 10%;
	}

	.interactions button {
		padding: 3%;
		border: none;
		cursor: pointer;
		border-radius: 10px;
	}

	.profilePic {
    float:left;
    border-radius: 50%;
    margin-bottom: 0;
    max-width: 80%;
}

	.game-history {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		width: 80%;
		/* border: 7px solid violet; */
		background-color: #3D3D3D;
		overflow-y: scroll;
		color: white;
		border: 5px solid palevioletred;
		/* border-radius: 10px; */
		z-index: 1000;
	}

	.history-title {
		text-align: center;
		padding-top: 2%;
		padding-bottom: 2%;
		border-bottom: 1px solid black;
	}

	.game {
		text-align: center;
		padding: 3%;
		border-bottom: 1px solid black;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.result {
		font-size: larger;
	}

	.scores {
		font-size: larger;
	}
</style>
