<script>
	import { db, storage } from '../firebase';
	import { collection, addDoc } from 'firebase/firestore';
	import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
	import { slide } from 'svelte/transition';
	import { goto } from '$app/navigation';

	let title = '';
	let desc = '';
	let type = '';
	let due;
	let grade;

	let file;
	let prog;
	let url = '';
	let fileTempName = '';

	let error = '';

	function valid() {
		console.log(due, grade, type);
		if (title.length > 30) {
			error = 'Error: Title Too Long';
			return false;
		}
		if (title.length === 0) {
			error = 'Error: No Value of Title';
			return false;
		}
		if (grade === undefined) {
			error = 'Error: No grade Selected';
			return false;
		}
		if (type === '') {
			error = 'Error: No type Selected';
			return false;
		}
		if (due === undefined) {
			error = 'Error: No Due Date Assigned';
			return false;
		}
		if (grade > 12 || isNaN(grade)) {
			error = 'Error: Invalid Class';
			return;
		}
		return true;
	}

	const addAssign = async () => {
		const tempD = new Date(due);
		if (valid()) {
			const docRef = await addDoc(collection(db, 'assignments'), {
				title: title,
				description: desc,
				type: type,
				deadline: tempD,
				status: 'open',
				isDone: [''],
				class: grade,
				file: url,
				fileName: fileTempName
			});

			goto(`/assigned/${docRef.id}`);
		}
	};

	const handleFile = () => {
		if (file && file[0]) {
			const storageRef = ref(storage, `refer/${file[0].name}`);
			console.log(file);
			const uploadTask = uploadBytesResumable(storageRef, file[0]);
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + prog + '% done');
					switch (snapshot.state) {
						case 'paused':
							console.log('Upload is paused');
							break;
						case 'running':
							console.log('Upload is running');
							break;
					}
				},
				(error) => {
					console.log(error);
				},
				() => {
					console.log('im run');
					getDownloadURL(storageRef).then((downloadURL) => {
						url = downloadURL;
						fileTempName = file[0].name;
					});
				}
			);
		}
	};

	const removeFile = () => {
		const storageRef = ref(storage, `refer/${file[0].name}`);
		deleteObject(storageRef).then(() => {
			console.log('Removed File');
		});
		file = [];
	};
</script>

<div class="create">
	<form action="">
		<div class="inputs" in:slide>
			<p>Title:</p>
			<input type="text" bind:value={title} />
			<p>Description:</p>
			<textarea bind:value={desc} style="resize:vertical" />
			<p>Due Date:</p>
			<input type="date" bind:value={due} />
			<div class="lmao">
				<div class="childInput" style="margin-right: 1.5em;">
					<p>For Class:</p>
					<input type="number" bind:value={grade} min="1" max="12" />
				</div>
				<div class="childInput" style="margin-right: 1.5em;">
					<p>Type:</p>
					<select bind:value={type}>
						<option value={'HW'}>Home Work</option>
						<option value={'Test'}>Concept Test</option>
						<option value={'HHW'}>Holiday Home Work</option>
					</select>
				</div>
			</div>

			<p>Reference:</p>
			<label for="attachFile">
				<h3 class="attachLabel"><i class="bi bi-paperclip" /> Attach File</h3>
				<input type="file" bind:files={file} id="attachFile" on:change={handleFile} />
			</label>
			{#if file && file[0]}
				<div class="file">
					<p><i class="bi bi-file-earmark-fill" /> {file[0].name}</p>
					{#if prog == 100}
						<p on:click={removeFile}><i class="bi bi-x-circle-fill" /></p>
					{:else}
						<p>{Math.round(prog)}%</p>
					{/if}
				</div>
			{/if}
			<button on:click|preventDefault={addAssign}>Add Assignment</button>
			<p class="error" style="color: rgb(240, 58, 94);">{error}</p>
		</div>
	</form>
	{#if file && file[0]}
		<br />
	{/if}
</div>

<style>
	.create {
		display: flex;
		justify-content: center;
	}
	.inputs {
		display: flex;
		flex-direction: column;
		background-color: rgb(66, 66, 66);
		border-radius: 5px;
		padding: 0.7em 1em;
		width: 600px;
		max-width: 95vw;
		box-sizing: border-box;
	}
	.inputs > *,
	.childInput > * {
		margin: 0.3em 0.2em;
		padding: 0.4em 0.7em;
		border-radius: 5px;
	}
	.inputs > p,
	.childInput > p {
		padding: 0;
		margin: 0.3em 0.2;
		color: #00cc99;
		font-weight: bold;
	}
	.lmao {
		display: flex;
		justify-content: space-between;
		margin: 0;
		padding: 0;
	}
	.childInput {
		width: 100%;
	}
	.childInput > input,
	select {
		width: 100%;
		box-sizing: border-box;
	}
	button {
		width: 30%;
		align-self: center;
		background: #00a47b;
		border: none;
		padding: 0.3em 0;
		font-size: 1em;
		font-weight: bolder;
		color: #b8fae9;
		min-width: max-content;
	}
	input,
	textarea {
		border: 2px solid #319177;
	}
	input[type='file'] {
		border: none;
	}
	.file {
		display: flex;
		background-color: #04765a;
		padding: 0.5em;
		margin: 0;
		width: max-content;
		border-radius: 5px;
	}
	.file > p {
		margin: 0.2em;
		font-weight: bolder;
	}
	input[type='file'] {
		display: none;
	}
	.attachLabel {
		margin: 0;
		padding: 0;
		color: #b8fae9;
		font-weight: bold;
	}
</style>
