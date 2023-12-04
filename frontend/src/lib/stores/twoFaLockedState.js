import { browser } from '$app/environment';
import { writable } from 'svelte/store';
// const initialLock: boolean = false;
export const twoFaLocked = writable(browser ? localStorage.getItem('twoFaLocked') === 'true' : false);
twoFaLocked.subscribe((value) => {
    if (browser) {
        localStorage.setItem('twoFaLocked', value.toString());
    }
});
//# sourceMappingURL=twoFaLockedState.js.map