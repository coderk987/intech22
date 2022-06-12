<script>
	import { auth } from '../firebase.js';
	import { sendPasswordResetEmail } from 'firebase/auth';
	import { goto } from '$app/navigation';

	let fields = [''];
	let err = '';
	let done = '';
	const forgotPass = () => {
		sendPasswordResetEmail(auth, fields[0])
			.then(() => {
				done = 'You have been Sent a Password Reset link in your Inbox';
			})
			.catch((error) => {
				err = error.message;
			});
	};
</script>

<div class="login">
	<center>
		<div class="form">
			<h1>Forgot Password</h1>
			<div class="email">
				<form action="">
					<div class="inputs">
						<p>Email:</p>
						<input type="email" bind:value={fields[0]} />
						<p style="color:whitesmoke; font-size:medium">{done}</p>
						<p style="color:rgb(240, 58, 94); font-size:medium">{err}</p>
						<button class="create" on:click|preventDefault={forgotPass}>Reset Password</button>
					</div>
				</form>
			</div>
			<h6>By continuing, you agree to Our Terms of Service, Privacy Policy</h6>
			<div class="ops">
				<h5><a href="/register" style="color:#b8fae9;"> Create an Account?</a></h5>
				<h5><a href="/login" style="color:#b8fae9;">Have and Account?</a></h5>
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
		overflow-y: hidden;
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
	.inputs > p {
		margin: 0 2em;
		padding: 0;
		align-self: flex-start;
		font-size: larger;
		font-weight: bolder;
	}
	input {
		margin: 1.5em 2em;
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
		.create {
			padding: 0.5em 1em;
		}
	}
</style>
