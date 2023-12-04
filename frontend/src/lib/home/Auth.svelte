<script context="module" lang="ts">
	import { loggedIn } from '../stores/loggedStore';
	import { userData } from '../stores/userDataStore';

	import { twoFaLocked } from '$lib/stores/twoFaLockedState';

	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import socket from '../../socket';

	let hostname;
	if (import.meta.env.SSR === false) {
      hostname = location.hostname;
    }
	const authEndpoint: string = `http://${hostname}:3000/auth/code`;
	const is2FAActivatedEndpoint: string = `http://${hostname}:3000/auth/2fa/getstatus`;
	const logoutEndpoint: string = `http://${hostname}:3000/auth/logout`;

	let authCode: string = '';
	// let myUserData: any = {
	// 	nickname: 'itaouil',
    // fullName:'',
    // // campus:'',
    // imageUrl:'',
    // id:0,
    // twoFA: false
	// };

	let myData: any;

	userData.subscribe((value) => {
		myData = value;
	})

	async function tradeCodeForData(code: string) {
		let content = { code: code };
		try {
			let data = await fetch(authEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(content)
			});
			if (data.ok) {
				console.log('code successfully sent!');
				let result: any = await data.json();
				if (result.twoFA === true)
				{
					twoFaLocked.set(true);
					userData.set(result);
					goto('/2fa');
				}
				else
				{
					receiveData(result);
				}
			}
		} catch (error) {
			// console.log('error:', error);
		}
	}

	async function receiveData(data: any) {
		if (data) {
			try {
				loggedIn.set(true);
				userData.set(data);
				socket.auth = { username: data.nickname };
				socket.connect();
			} catch (err) {
				console.log('error: ', err);
			}
		} else
		{
			console.log('not logged yet');
		}
	}

	export async function logIn() {
		let fullUrl = new URL(window.location.href);
		let code = fullUrl.searchParams.get('code');
		if (code) {
			authCode = code;
			await tradeCodeForData(code);
		}
	}

	export async function logOut() {

		let data = await fetch(logoutEndpoint, {
			method: "POST", 
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(myData)
		})
		if (data.ok)
		{
			let success: boolean = await data.json();
			if (success)
			{
				loggedIn.set(false);
				socket.disconnect();
				if (browser)
					window.localStorage.removeItem('userData');
				return ;
			}
		}
		alert("Internal error.");
		// supprimer les données du local storage
	}
</script>
