<script>
	import { db, auth } from '../firebase.js';
	import { collection, onSnapshot, where, query } from 'firebase/firestore';
	import { scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { user } from '../stores.js';

	function isComplete(i) {
		let a = i.isDone;
		if (a.indexOf($user.displayName.split(' ')[0]) < 0) return true;
		return false;
	}

	let q = query(
		collection(db, 'assignments'),
		where('status', '==', 'open'),
		where('class', '==', Number($user.displayName.split(' ')[1]))
	);
	let list = [];
	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		let fb = [];
		querySnapshot.forEach((doc) => {
			let item = { ...doc.data(), id: doc.id };
			fb = [item, ...fb];
		});
		list = fb;
		list = list.filter(isComplete);
	});
</script>

<div class="ass" in:scale>
	{#each list as item}
		<div class="item">
			<div class="itemTop">
				<h3
					on:click={() => {
						goto(`/assigned/${item.id}`);
					}}
					class="title"
				>
					{item.title}
				</h3>
				<h3 class="type">Type: {item.type}</h3>
			</div>
			<div class="itemDown">
				<h4 class="due">Due: {item.deadline.toDate().toLocaleString()}</h4>
			</div>
		</div>
	{/each}
</div>

<style>
	.item {
		margin: 0.5em 1.5em;
		width: 90%;
		padding: 0.3em 1em;
		border: 4px solid #319177;
		border-radius: 15px;
		background-color: rgb(66, 66, 66);
		color: black;
	}
	.ass {
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow-y: auto;
	}
	.itemTop {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	.type {
		margin-right: 0.5em;
		background-color: #7ddbc2;
		padding: 0.2em 0.5em;
		border-radius: 20px;
		margin-bottom: 0;
	}
	.title {
		color: #00cc99;
		font-size: x-large;
		font-weight: bolder;
		margin-bottom: 0;
		cursor: pointer;
	}
	.due {
		color: rgb(240, 58, 94);
	}
	.itemDown {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	@media screen and (max-width: 680px) {
		.item {
			box-sizing: border-box;
			width: 95%;
		}
	}
</style>
