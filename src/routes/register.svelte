<script>
	import { auth, db } from '../firebase.js';
	import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { setDoc, doc } from 'firebase/firestore';

	let fields = [null, null, null, null, false];

	let err = '';

	function isValid() {
		if (fields[1] === null) {
			err = 'Error: Invalid Username';
			return;
		}
		if (fields[1].length > 10) {
			err = 'Error: Username too Long';
			return;
		}
		if (fields[3] === null) {
			err = 'Error: Invalid Class';
			return;
		}
	}

	const signInEmail = async () => {
		createUserWithEmailAndPassword(auth, fields[0], fields[2])
			.then(async (cred) => {
				console.log(cred.user);
				updateProfile(auth.currentUser, {
					displayName: `${fields[1]} ${fields[3]}`
				});
				await setDoc(doc(db, 'users', fields[0]), {
					class: fields[3],
					isAdmin: fields[4],
					name: fields[1]
				});
				goto('/login');
			})
			.catch((error) => {
				err = error.message;
			});
	};
</script>

<div class="login">
	<center>
		<div class="form">
			<h1>Register</h1>
			<div class="email">
				<form action="">
					<div class="inputs">
						<p>Email:</p>
						<input type="email" bind:value={fields[0]} />
						<p>Username:</p>
						<input type="text" bind:value={fields[1]} />
						<p>Password:</p>
						<input type="password" bind:value={fields[2]} />
						<div class="classInfo">
							<div class="infoChild">
								<p>Class:</p>
								<input type="number" bind:value={fields[3]} min="1" max="12" />
							</div>
							<div class="infoChild">
								<p>Role:</p>
								<select name="" id="" bind:value={fields[4]}>
									<option value={true}>Teacher</option>
									<option value={false}>Student</option>
								</select>
							</div>
						</div>
						<p style="color:rgb(240, 58, 94); font-size:medium">{err}</p>
						<button class="create" on:click|preventDefault={signInEmail}>Create Account</button>
					</div>
				</form>
			</div>
			<h6>By continuing, you agree to Our Terms of Service, Privacy Policy</h6>
			<div class="ops">
				<h5><a href="/login" style="color:#b8fae9;">Have An Account?</a></h5>
				<h5><a href="/forgot" style="color:#b8fae9;">Forgot Password.</a></h5>
			</div>
		</div>
	</center>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap');
	* {
		font-family: 'Noto Sans', sans-serif;
		color: #00cc99;
	}
	.login {
		overflow-y: auto;
		background-color: #2a2a2a;
		height: 100vh;
	}
	.form {
		width: 550px;
		max-width: 90vw;
		background-color: rgb(66, 66, 66);
		margin-top: 10vh;
		border-radius: 10px;
		box-sizing: border-box;
		padding-bottom: 20px;
		border: 2px solid rgb(171, 171, 171);
		box-shadow: inset 0 -3em 3em rgba(0, 0, 0, 0.1), 0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
	}
	h1 {
		background-color: #222423;
		border-radius: 10px 10px 2px 2px;
		margin: 0;
		margin-bottom: 0.5em;
		padding: 0.2em;
		font-weight: 700;
	}
	.inputs {
		display: flex;
		flex-direction: column;
	}
	.inputs > p,
	.infoChild > p {
		margin: 0 2em;
		padding: 0;
		align-self: flex-start;
		font-size: larger;
		font-weight: bolder;
	}
	input,
	select {
		margin: 0.7em 2em;
		padding: 0.2em 0.5em;
		border-radius: 5px;
		font-size: large;
		color: #181818;
	}
	h6 {
		margin: 0;
	}

	.ops {
		display: flex;
		justify-content: center;
	}
	.ops > h5 {
		margin: 1em 2em;
		margin-bottom: 0;
	}

	a {
		color: #b8fae9;
		text-decoration: none;
		color: black;
	}

	button.create {
		align-self: center;
		padding: 0.5em 0.1em;
		width: 30%;
		background-color: #00a47b;
		border: 1px solid #1ab766;
		border-radius: 5px;
		margin: 0.4em 0.2em;
		color: #b8fae9;
		font-weight: bolder;
		min-width: max-content;
	}
	.classInfo {
		display: flex;
		justify-content: space-between;
		margin: 0;
		padding: 0;
	}
	.infoChild {
		display: flex;
		flex-direction: column;
		align-content: flex-start;
		width: 50%;
	}
	@media screen and (max-width: 500px) {
		input {
			margin: 1em;
		}
		.inputs > p {
			margin: 0 1em;
		}
	}
	@media screen and (max-width: 391px) {
		input {
			margin: 0.7em;
		}
		.inputs > p {
			margin: 0 0.7em;
		}
		.ops > h5 {
			margin: 1em;
			margin-bottom: 0;
		}
		button.create {
			padding: 0.5em 20px;
		}
	}
</style>
