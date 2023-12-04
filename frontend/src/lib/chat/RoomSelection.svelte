<script lang="ts">
	import RoomPasswordPopup from "./RoomPasswordPopup.svelte";
    import socket from "../../socket";
    import { userData } from "$lib/stores/userDataStore";
    import { Room } from "./RoomClass";

	import { onMount } from "svelte";
	import { goto } from "$app/navigation";


    let hostname;
	if (import.meta.env.SSR === false) {
      hostname = location.hostname;
    }

    const chatEndpoint: string = `http://${hostname}:3000/chat`;
    // let getRoomStatusEndpoint: string = `/roomstatus`;
    const roomStatusEndpoint: string = `http://${hostname}:3000/chat/roomStatus`;

    export let roomSelected: string;
    export let passwordRequired: boolean = false;
    let typedInRoom: string = "";

    let publicRoomsDisplayed: boolean = true;

    let actualRoomsList: Room[] = [];
    let myRooms: string[];

    // let roomsList: string[] = ["room1", "room2", "room3", "room4"]; // seulement pour les tests; à récupérer dans la DB plus tard
    // let myRoomsList: string[] = ["room5", "room6", "room7"]; // idem
    // ces 2 variables sont à supprimer plus tard : test only

    let passwordPopup: boolean = false;
    

    onMount(() => {
        socket.on("public rooms", (data) => {
            // console.log("here are the public rooms");
            // console.log(data);
            data.forEach((room: any) => {
                let owned: boolean = false;

                if (room.owner === $userData.nickname)
                    owned = true;
                let newRoom: Room = new Room(room.name, room.private, owned);
                if (room.password === true)
                    newRoom.isProtected = true;

                actualRoomsList.push(newRoom);
            });
            actualRoomsList = actualRoomsList;
        })
        // récupérer la liste des rooms publiques et mettre ça dans actualRoomsList
        // contient toutes leurs infos et si elles sont protégées ou pas notamment 
    
        // récupérer la liste de MES rooms et mettre ça dans myRooms
        socket.on("rooms list", (myRoomsList: string[]) => {
            myRooms = myRoomsList;
        });

        socket.on("room not found", () => {
            alert("Room not found.");
        });

        socket.on("Internal error", () => {
            alert("Internal error. Please try again later.");
        });

        // socket.on("banned from room", () => {
        //     alert("You are banned from joining this room.");
        // });
        
        socket.on("Join success", () => {
            goto("/chat/room" + "?room=" + roomSelected);
        });

        socket.emit("getMyRooms", $userData);
        // console.log("emitting getPublicRooms signal");
        socket.emit("getPublicRooms");

    })

    function getRoomStatus(roomToFind: string)
    {
        // trouver la room dans actualRoomsList et vérifier si elle est protected ou pas
        const roomSelected: Room | undefined = actualRoomsList.find(room => room.roomName === roomToFind);

        if (roomSelected)
        {
            return (roomSelected.isProtected);
        }
        throw new Error("404");
    }
    
    function joinRoom(event: MouseEvent)
    {
        try {
            const clickedRoom = event.target as HTMLElement;
            const roomName = clickedRoom.innerText;
            roomSelected = roomName;
            // console.log("trying to join", roomName);

            if ((typedInRoom !== "" || typedInRoom) && !isAlphaNum(typedInRoom))
            {
                alert("Room name should include alphabetical and numeric characters only");
                return ;
            }
            
            const roomPrivate: boolean = getRoomStatus(roomSelected)
            console.log(roomSelected, "'s private status is", roomPrivate);
            if (roomPrivate)
            {
                passwordRequired = true;
                passwordPopup = true;
            }
            else
            {
                const data: any = {
                    roomName: roomSelected,
                    password: "",
                    userData: $userData
                };
                socket.emit("joinRoom", data);
            }
        }
        catch (error)
        {
            alert("Not found. Please try again later.")
        }
    }

    function toggleRoomDisplay()
    {
        publicRoomsDisplayed = !publicRoomsDisplayed;
    }

    async function fetchRoomStatus(roomName: string)
    {
        try {

            let content: any = {
                roomName: roomName,
                userData: $userData
            };
            
            let data = await fetch(roomStatusEndpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(content)
            });
            if (data.ok)
            {
                let roomStatus = await data.json();
                return (roomStatus);
            }
            return (500);
        }
        catch (error) {
            return (500);
        }
    }

    function isAlphaNum(str: string): boolean
    {
        const regex = /^[a-zA-Z0-9]+$/;
        return (regex.test(str));
    }

    async function typeRoomName()
    {
        if (typedInRoom === "")
            return ;
        if (!isAlphaNum(typedInRoom))
        {
            alert("Room name should include alphabetical and numeric characters only.");
            typedInRoom = "";
            return ;
        }

        const roomStatus: boolean | number = await fetchRoomStatus(typedInRoom);

        if (roomStatus === 500)
            alert("Internal error. Please try again later.");
        else if (roomStatus === 404)
            alert("This room doesn't exist.");
        else
        {
            roomSelected = typedInRoom;
            if (roomStatus === false)
            {
                passwordRequired = true;
                passwordPopup = true;
            }
            else
            {
                const data: any = {
                    roomName: roomSelected,
                    password: "",
                    userData: $userData
                };
                socket.emit("joinRoom", data);
            }
        }
    }
</script>
    
    <div class="rooms-container">
    
        <div class="title">
            <h1>PICK A ROOM & COME CHAT</h1>
        </div>
        <div class="rooms-list">
            <ul>
                {#if publicRoomsDisplayed}
                    {#each actualRoomsList as room}
                        <li on:click={joinRoom}>{room.roomName}</li>
                    {/each}
                        <li on:click={toggleRoomDisplay}>see my rooms</li>
                {:else}
                    {#each myRooms as myRoom}
                        <li on:click={joinRoom}>{myRoom}</li>
                    {/each}
                        <li on:click={toggleRoomDisplay}>see public rooms</li>
                {/if}
                <!--<li class="type-room">join room by its name:
                <input type="text" id="room-to-join-input" bind:value={typedInRoom}>
                <button on:click={typeRoomName}>join</button>
                </li>-->
            </ul>
        </div>
    </div>

    <!-- {#if passwordPopup}
        <RoomPasswordPopup roomToCheck={roomSelected} />
    {/if} -->
<style>
        .rooms-container {
            font-family: "Coolvetica";
            color: white;
            background-color: black;
            background-repeat: no-repeat;
            background-position: center;
            background-color: rgba(0, 0, 0, 0.7);
            width: 60%;
            height: 60%;
            margin: 5% auto;
            border-radius: 3px;
            border: 4px double white;
            display: flex;
            flex-direction: column;
            letter-spacing: 2px;
            /* overflow-y: scroll; */
        }
        
        .title {
            padding: 15px;
            text-align: center;
            border-bottom: 4px double white;
            background-color:#2d1cb0;
            height: 10%;
        }
        
        .rooms-list {
            max-height: 100%;
            overflow-y: auto;
        }
        
        .rooms-list ul {
            /* max-height: 90%; */
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
        
        .rooms-list ul li {
            flex-grow: 1;
            /* height: auto; */
            padding: 10px;
            border: 1px solid white;
            display: flex;
            align-items: center;
            cursor: pointer;
        }

        .type-room {
            display: flex;
            column-gap: 1%;
        }

        .type-room button {
            padding: 0.5% 2% 0.5% 2%;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            background-color: white;
        }
</style>