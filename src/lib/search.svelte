<script>
	import { goto } from '$app/navigation';
	import { collection, getDocs, query, where } from 'firebase/firestore';
	import { auth, db } from '../firebase';
	import { fade } from 'svelte/transition';

	let inputQ = '';
	let res = [];

	const searchQuery = async () => {
		const querySnapshot = await getDocs(
			query(
				collection(db, 'assignments'),
				where('class', '==', Number(auth.currentUser.displayName.split(' ')[1]))
			)
		);
		let fb = [];
		querySnapshot.forEach((doc) => {
			let i = { ...doc.data(), id: doc.id };
			const temp1 = i.title.toLowerCase();
			const temp2 = inputQ.toLowerCase();
			if (temp1.includes(temp2)) {
				fb = [i, ...fb];
			}
		});
		res = fb;
	};
</script>

<div class="bg" on:click|self>
	<div class="search" transition:fade={{ duration: 400 }}>
		<input
			type="text"
			bind:value={inputQ}
			on:input={searchQuery}
			placeholder="Start Typing to Search"
		/>
		<hr />
		<h2 style="align-self: flex-start; color: #00CC99;">Results:</h2>
		<div class="results">
			{#each res as item}
				<div class="item">
					<h3 on:click={goto(`/assigned/${item.id}`)}>{item.title}</h3>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	h3 {
		padding: 0;
		margin: 0.1em 0;
	}
	.bg {
		width: 100vw;
		height: 100vh;
		position: fixed;
		background: rgba(0, 0, 0, 0.2);
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-top: 5em;
	}
	.search {
		background-color: #1c1b1b;
		min-width: 100px;
		width: 630px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5em;
		border-radius: 5px;
		max-width: 95vw;
		box-sizing: border-box;
	}
	input {
		width: 95%;
		padding: 0.3em 0.5em;
		font-size: larger;
		border-radius: 10px;
	}
	.results {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.item {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		padding: 0;
		margin-bottom: 5px;
		color: #b8fae9;
	}
</style>
