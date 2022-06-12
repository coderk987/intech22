import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIRE_KEY,

	authDomain: 'svelte-school.firebaseapp.com',

	projectId: 'svelte-school',

	storageBucket: 'svelte-school.appspot.com',

	messagingSenderId: '16141293241',

	appId: import.meta.env.VITE_FIRE_ID
};

let app;
if (getApps.length === 0) {
	app = initializeApp(firebaseConfig);
} else {
	getApp();
}

export const db = getFirestore(app);
export const auth = getAuth();
setPersistence(auth, browserLocalPersistence).then(() => {
	console.log('set local persistence');
});
export const storage = getStorage(app);
