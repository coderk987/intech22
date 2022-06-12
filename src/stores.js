import { writable } from 'svelte/store';
import { browser } from '$app/env';

let tempSet = browser && localStorage.getItem('curUser');
export let user = writable(tempSet ? JSON.parse(tempSet) : '');

if (browser) {
	user.subscribe((u) => (localStorage.curUser = JSON.stringify(u)));
}
