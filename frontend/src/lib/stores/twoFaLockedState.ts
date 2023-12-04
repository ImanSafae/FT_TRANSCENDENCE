import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// const initialLock: boolean = false;

export const twoFaLocked: Writable<boolean> = writable(browser ? localStorage.getItem('twoFaLocked') === 'true' : false);

twoFaLocked.subscribe((value: boolean) =>
{
    if (browser)
    {
        localStorage.setItem('twoFaLocked', value.toString());
    }
});
