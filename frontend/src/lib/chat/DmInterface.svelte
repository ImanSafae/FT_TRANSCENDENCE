<script lang="ts">

    import { onMount } from "svelte";
	// import { io } from "socket.io-client";
    import socket from "../../socket";

    import { userData } from "$lib/stores/userDataStore";
	import Auth from "$lib/home/Auth.svelte";
	import { goto } from "$app/navigation";

    // export let convos: any;
    let convos: string[] = [];

    let message: string = "";
    let selectedConvoBool: boolean = false;
    let selectedConvo: { interlocutor: string, messages: any[] } ;

    let newDmTarget: string = "";
    
    onMount(() => {
        socket.emit("getConvosList", $userData);

        socket.on("private convos list", (data: string[]) => {
            const filteredConvoList = data.filter((convo) => {
                return !$userData.blocklist.includes(convo);
            });
            console.log("private convos list:",filteredConvoList);
            convos = filteredConvoList;
        });

        socket.on("user exists", (data: boolean) => {
            if (data === false)
            {
                alert("This user doesn't exist!");
                newDmTarget = "";
                return ;
            }
            let newDm: any = {
            interlocutor: newDmTarget,
            messages: []
            };

            convos.push(newDmTarget);
            convos = convos;
            selectedConvo = newDm;
            selectedConvoBool = true;
            newDmTarget = "";
        });

        socket.on("private message", (data: any) => {
            // const convoToFind = convos.summaries.find((convo: any) => convo.interlocutor === data.interlocutor);
            const sender: string = data.sender.username;
            let blocked: boolean = false;
			$userData.blocklist.forEach((blockedUser: string) => {
				if (blockedUser === sender)
				{
					blocked = true;
					return ;
				}
			});
			if (blocked)
				return ;
            if (!convos.includes(sender)) // nouvelle conversation
            {
                convos.push(sender);
                convos = convos;
                return ;
            }
            if (!selectedConvo)
                return ;
            if (selectedConvo.interlocutor !== sender)
                return ;
            selectedConvo.messages.push(data);
            selectedConvo.messages = selectedConvo.messages;
        });


        socket.on("Internal error", () => {
            alert("Internal error. Please try again later.");
            goto("/chat");
        });

        socket.on("dms conversation", (data: any) => {
            if (!selectedConvoBool || !selectedConvo)
                return ;
            selectedConvo.messages = data;
            selectedConvo = selectedConvo;
        });

    })


    function selectConvo(event: MouseEvent, convo: string)
    {
        // console.log("objet cliqué");
        const target = event.target as HTMLElement;
        const targetDiv = target.closest(".convo");
        if (targetDiv)
        {
            socket.emit("getPrivateConversation", {
                target: convo,
                userData: $userData});
            selectedConvo = {interlocutor: convo,
                messages: []};
            selectedConvoBool = true;
        }
    }
    
    function sendMessage()
    {
        if (!selectedConvoBool || !selectedConvo || !message)
            return ;
    
        let blocked: boolean = false;
		$userData.blocklist.forEach((blockedUser: string) => {
			if (blockedUser === selectedConvo?.interlocutor)
			{
	    		blocked = true;
                alert("You can't message this user because you blocked them.");
				return ;
			}
		});
		if (blocked)
        {
			return ;
        }
        const dataToSend = {
            recipient: selectedConvo?.interlocutor,
            message: message,
            userData: $userData
        };
        
        const newMessage: any = {
            id: undefined,
            senderId: undefined,
            receiverId: undefined,
            content: message,
            createdAt: undefined,
            sender: {username: $userData.nickname},
            receiver: {username: selectedConvo.interlocutor}
        };
        selectedConvo.messages = [ ...selectedConvo.messages, newMessage];
        
        socket.emit("privateMessage", dataToSend);
        message = "";
    }

    async function newDm()
    {
        if (newDmTarget === "")
            return ;

        let blocked: boolean = false;
		$userData.blocklist.forEach((blockedUser: string) => {
			if (blockedUser === newDmTarget)
			{
				blocked = true;
                alert("You can't message this user because you blocked them.");
				return ;
			}
		});
		if (blocked)
        {
            return ;
        }
        // checker si newDmTarget existe déjà dans convos;
        if (convos.includes(newDmTarget))
        {
            selectedConvo = { interlocutor: newDmTarget, 
                messages: []
            };
            selectedConvoBool = true;
            // si oui, ouvrir la conv avec lui et return
            // appeler ici une fonction qui recup les dms
            socket.emit("getPrivateConversation", {
                target: newDmTarget,
                userData: $userData
            });
            return ;
        }

        socket.emit("userExists", newDmTarget);
        // si non : créer un objet et l'ajouter dans convos, et l'afficher
        // let newDm: any = {
        //     interlocutor: newDmTarget,
        //     messages: []
        // };

        // convos.push(newDmTarget);
        // convos = convos;
        // // selectedConvo = convos[convos.length - 1];
        // selectedConvo = newDm;
        // // console.log(selectedConvo);
        // selectedConvoBool = true;
        // newDmTarget = "";
    }

</script>

<div class="container">
    <div class="dm-container">
        <div class="header">
            <h3>CONVERSATIONS</h3>
        </div>
        <div class="new-dm">
            <label for="new-dm-input">Start a new conversation</label>
            <input type="text" id="new-dm-input" placeholder="nickname" bind:value={newDmTarget}>
            <button on:click={newDm}>say hi</button>
        </div>
        <ul class="convo-list">
            {#each convos as convo}
                <li on:click={(e) => selectConvo(e, convo)}>
                    <div class="convo">
                        <p class="msg-author">{convo}</p>
                    </div>
                </li>
             {/each}
        </ul>
    </div>

    <div class="message-area-container">
        <div class="header">
            {#if selectedConvoBool}
                <h3><a href="#" on:click={() => {goto(`/profile?login=${selectedConvo?.interlocutor}`)}}>{selectedConvo?.interlocutor}</a></h3>
            {/if}
        </div>
        <ul class="message-list">
            {#if selectedConvoBool && selectedConvo && selectedConvo.messages}
                {#each selectedConvo.messages as msg}
                <p>{msg.sender.username}: {msg.content}</p>
                {/each}
            {/if}
        </ul>
        <div class="input-area">
            <textarea placeholder="Message" bind:value={message}></textarea>
            <button on:click={sendMessage}>SEND</button>
        </div>
    </div>
</div>

<style>

    .container {
        display: flex;
        width: 98vw;
        height: 80vh;
        border: 1px solid black;
        margin-top: 3%;
        position: fixed;
        /* transform: translate(-50%, 0); */
    }
    
    /* CONVERSATIONS LIST ZONE */

    .new-dm {
        margin-bottom: 5%;
        padding: 6%;
    }

    .new-dm input {
        max-width: 60%;
        display: inline;
    }

    .new-dm button {
        padding: 2%;
        border-radius: 10px;
        border: none;
        cursor: pointer;
    }

    .dm-container {
        width: 20%;
        height: 100%;
        border-right: 1px solid black;
        background-color: white;
        display: flex;
        flex-direction: column;
        font-family: Arial, Helvetica, sans-serif;
    }

    .header {
        padding: 2%;
        height: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .convo-list {
        list-style-type: none;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        /* border: 1px solid red; */
        overflow-y: scroll;
    }
    
    .convo {
        border-top: 1px solid black;
        border-radius: 10px;
        padding: 2%;
        cursor: pointer;
    }

    .convo:active {
        background-color: lightgray;
    }
    
    .convo .msg-author {
        flex-grow: 1;
        text-decoration: none;
        font-weight: bold;
        font-size: larger;
        margin-left:2%;
        margin-top: 2%;
    }

    .convo .msg-line {
        margin-left: 2%;
        margin-bottom: 2%;
    }

    .unread-msg-notice {
        color: red;
    }

    /* CURRENT CONVERSATION ZONE */

    .message-area-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        background-color: white;
    }
    
    .message-area-container .message-list {
        box-sizing: border-box;
        width: 100%;
        height: 85%;
        padding: 1%;
        overflow-y: scroll;
    }

    .message-area-container .message-list p {
        margin-bottom: 1px;
    }

    .message-area-container .header {
        background-color: lightgray;
        /* border-bottom: 1px solid black; */
    }

    .message-area-container .input-area {
        height:15%;
        /* border: 1px solid black; */
        width: 100%;
        display: flex;
        align-items: stretch;
    }

    .message-area-container .input-area textarea {
        width: 100%;
        height: 100%;
        resize: none;
        /* padding: 1%; */
        outline: none;
    }

    .message-area-container .input-area button {
        padding: 1%;
        height: 100%;
    }
</style>