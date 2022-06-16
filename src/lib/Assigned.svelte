<script>
	import { db, auth } from '../firebase.js';
	import { collection, onSnapshot, where, query, deleteDoc, doc } from 'firebase/firestore';
	import { scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { user } from '../stores.js';
	import { flip } from 'svelte/animate';

	export let lmaoAdmin;

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

	const deleteAssigned = async (id) => {
		await deleteDoc(doc(db, 'assignments', id));
	};
</script>

<div class="ass" in:scale>
	{#each list as item (item.id)}
		<div class="item" out:scale|local animate:flip={{ duration: 500 }}>
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
				{#if lmaoAdmin}
					<i
						class="bi bi-trash3"
						on:click={() => {
							deleteAssigned(item.id);
						}}
					/>
				{/if}
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
		overflow-x: hidden;
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
		position: relative;
		min-width: max-content;
	}
	.title {
		color: #00cc99;
		font-size: x-large;
		font-weight: bolder;
		margin-bottom: 0;
		cursor: pointer;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.title:hover {
		color: #3bdfc4;
		transition: 0.2;
	}
	.due {
		color: rgb(240, 58, 94);
	}
	.itemDown {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	i {
		background-color: rgb(243, 52, 90);
		border: 2px solid rgb(181, 35, 64);
		width: max-content;
		padding: 0.3em 0.5em;
		margin: 0;
		align-self: center;
		font-size: 1.2em;
		margin: 0 0.5em;
		border-radius: 5px;
		color: whitesmoke;
		cursor: pointer;
	}
	@media screen and (max-width: 680px) {
		.item {
			box-sizing: border-box;
			width: 95%;
		}
	}
</style>
