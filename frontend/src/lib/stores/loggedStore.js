import { browser } from '$app/environment';
import { writable } from 'svelte/store';
const initialLog = false;
// const currentState = browser ? localStorage.getItem('loggedIn') ?? initialLog : initialLog;
export const loggedIn = writable(browser ? localStorage.getItem('loggedIn') === 'true' : false);
loggedIn.subscribe((value) => {
    if (browser) {
        localStorage.setItem('loggedIn', value.toString());
    }
});
//# sourceMappingURL=loggedStore.js.map