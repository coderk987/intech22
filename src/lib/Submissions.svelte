<script>
	import { db, auth } from '../firebase.js';
	import {
		arrayUnion,
		collection,
		doc,
		onSnapshot,
		query,
		updateDoc,
		where,
		arrayRemove
	} from 'firebase/firestore';
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let id;

	let list = [];
	let q = query(collection(db, `assignments${id}/submits`), where('done', '==', false));
	$: {
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			let fb = [];
			querySnapshot.forEach((doc) => {
				let item = { ...doc.data(), id: doc.id };
				fb = [item, ...fb];
			});
			list = fb;
		});
	}

	const AcceptFile = async (by, tag) => {
		const ref1 = await updateDoc(doc(db, 'assignments', id), {
			isDone: arrayUnion(by)
		});
		const ref2 = await updateDoc(doc(db, `assignments${id}/submits`, tag), {
			done: true
		});
	};

	const RejectFile = async (by, tag) => {
		const ref1 = await updateDoc(doc(db, 'assignments', id), {
			isDone: arrayRemove(by)
		});
		const ref2 = await updateDoc(doc(db, `assignments${id}/submits`, tag), {
			done: false
		});
	};

	let t = 1;
</script>

<div>
	<div class="tabs">
		<h2
			style="margin-right: 2em;"
			on:click={() => {
				q = query(collection(db, `assignments${id}/submits`), where('done', '==', false));
				t = 1;
			}}
			class:active={t == 1}
		>
			Submissions For Review
		</h2>
		<h2
			on:click={() => {
				q = query(collection(db, `assignments${id}/submits`), where('done', '==', true));
				t = 2;
			}}
			class:active={t == 2}
		>
			Accepted Submissions
		</h2>
	</div>

	<div class="items">
		{#each list as item (item.id)}
			<div class="item" out:scale|local animate:flip={{ duration: 500 }}>
				<div class="itemTop">
					<h3><a href={item.file} target="_blank">Attached File</a></h3>
					<h4>Submitted By{item.by}</h4>
				</div>
				{#if item.done}
					<button on:click={() => RejectFile(item.by, item.id)} class="reject"
						><i class="bi bi-x-circle" /></button
					>
				{:else}
					<button on:click={() => AcceptFile(item.by, item.id)} class="accept"
						><i class="bi bi-check2-circle" /></button
					>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.tabs {
		display: flex;
		justify-content: center;
	}
	.active {
		transform: scale(1.1);
		padding-bottom: 4px;
		border-bottom: 3px solid #319177;
		color: #b8fae9;
		transition: 0.2s;
	}
	.items {
		display: grid;
		grid-template-columns: 1fr 1fr;
		overflow-y: auto;
	}
	.item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		background-color: rgb(66, 66, 66);
		margin: 1em 1em;
		padding: 0 1em;
		border-radius: 10px;
	}
	a {
		text-decoration: none;
		color: #b8fae9;
	}
	.accept {
		align-self: center;
		height: 50px;
		width: 50px;
		border-radius: 100%;
		background-color: #24a76a;
		border: 1px solid rgb(39, 80, 45);
		font-size: x-large;
		font-weight: bold;
	}
	.reject {
		align-self: center;
		height: 50px;
		width: 50px;
		border-radius: 100%;
		background-color: rgb(207, 35, 69);
		border: 1px solid rgb(149, 0, 30);
		font-size: x-large;
		font-weight: bold;
	}

	@media screen and (max-width: 630px) {
		.items {
			grid-template-columns: 1fr;
		}
		.tabs > h2 {
			font-size: 1.2em;
		}
	}
</style>
