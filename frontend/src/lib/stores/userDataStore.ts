import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

import type { UserDataDto } from '$lib/dto/models.dto';

// Valeur de base à utiliser uniquement à la première connexion -> il n'y a encore rien dans le local storage
const initialData: UserDataDto = {
    nickname: '',
    fullName:'',
    imageUrl:'',
    id:0,
    twoFA: false,
    blocklist: [],
    pseudo: ''
};

const storedData = browser ? localStorage.getItem('userData') ?? initialData  : initialData;

export const userData = writable(typeof(storedData) == 'string' ? JSON.parse(storedData) : initialData);
    
userData.subscribe((value) => {
    if (browser)
        window.localStorage.setItem("userData", JSON.stringify(value));
});

// On définit un store : initialisé à la valeur du local storage, ou s'il est vide, à la valeur de base
// On récupère ce qu'il y a dans le local storage (rien si première connexion)