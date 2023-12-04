<script lang="ts">
	import { backIn } from "svelte/easing";

    import UserForm from "./UserForm.svelte";
    import { userData } from "../stores/userDataStore";

    let hostname;
	if (import.meta.env.SSR === false) {
      hostname = location.hostname;
    }

    const photoUploadEndpoint: string = `http://${hostname}:3000/user/newProfilePic`;
    let selectedImage: any = null;

    let fileInput: HTMLElement;

    export let wins: number = 0;
    export let losses: number = 0;

    function openFileInput()
    {
        if (fileInput)
            fileInput.click();
    }

    async function sendImage(event: any) {
    try {
        const files = event.target?.files;
        if (files && files.length > 0) {
            const selectedImage = files[0];
            
            const formData = new FormData();
            selectedImage.filename = $userData.nickname;
            formData.append('userData', JSON.stringify($userData));
            formData.append('profileImage', selectedImage);

            const response = await fetch(photoUploadEndpoint, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.text();
                if (result === "false") {
                    alert("Error during photo upload. Please try again later.");
                } else {
                    $userData.imageUrl = result;
                }
            } else {
                console.log("Error:", response.statusText);
            }
        } else {
            console.log("No files selected.");
        }
    } catch (error) {
        console.log("Error:", error);
    }
}


</script>

<div class="container">
    <div class="user-info">
        <img src={$userData.imageUrl} class="profilePic" alt="This is you!">
        <div class="photo-upload">
            <button class="photo-upload-button" on:click={openFileInput}>
                <img src="camera.png" class="camera-icon" alt="Click to change profile pic">
            </button>
            <input type="file" accept="image/*" style="display: none;" bind:this={fileInput} on:change={(e)=>sendImage(e)}/>
        </div>
        <div class="user-description">
            <h2>Welcome back, {$userData.nickname}</h2>
            <h3> alias {$userData.fullName}</h3>
            <h3>in game name: {$userData.pseudo}</h3>
            <br>
            <div class="game-stats">
                <h2 style="text-align:center">Games played</h2>
                <h3>Victories: {wins}</h3>
                <h3>Losses: {losses}</h3>
            </div> 
        </div>
    </div>
</div>
<br>


<style> 

.container {
    width: 100%;
    border: solid 7px palevioletred;
	border-radius: 10px;
    height: auto;
    font-family: "Coolvetica";
    display: flex;
    justify-content: center;
    background-image: url("ffflurry.svg");
    background-size: cover;
    background-repeat: no-repeat;
    -webkit-text-fill-color: white;
    -webkit-text-stroke: 0.8px black;
    padding-top: 5%;
    left: 0;
}

.user-info {
    display: flex;
    flex-direction: column;
    /* position:absolute; */
    width: auto;
    height: auto;
    color:white;
    align-items: center;
    /* row-gap: 20px; */
}

.profilePic {
    float:left;
    border-radius: 50%;
    margin-bottom: 0;
    max-width: 80%;
}

.user-description {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    max-width: 80%;
}

.camera-icon {
    width: 10%;
    max-width: 100%;
    cursor: pointer;
    align-self: flex-end;
}

.photo-upload-button {
    width: auto;
    border: none;
    background: none;
    margin: 0;
    transform:translateY(-50%);
}
</style>