import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

const initialLog: boolean = false;

// const currentState = browser ? localStorage.getItem('loggedIn') ?? initialLog : initialLog;

export const loggedIn: Writable<boolean> = writable(browser ? localStorage.getItem('loggedIn') === 'true' : false);

loggedIn.subscribe((value: boolean) =>
{
    if (browser)
    {
        localStorage.setItem('loggedIn', value.toString());
    }
});
