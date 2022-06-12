<script>
	import { db, auth } from '../firebase.js';
	import { collection, onSnapshot, where, query } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	let q = query(
		collection(db, 'assignments'),
		where('isDone', 'array-contains', auth.currentUser.displayName.split(' ')[0]),
		where('class', '==', Number(auth.currentUser.displayName.split(' ')[1]))
	);
	let list = [];
	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		let fb = [];
		querySnapshot.forEach((doc) => {
			let item = { ...doc.data(), id: doc.id };
			fb = [item, ...fb];
		});
		list = fb;
	});
</script>

<div class="ass">
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
	}
	.due {
		color: crimson;
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
