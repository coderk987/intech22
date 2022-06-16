<script context="module">
	/*
	<script context="module">
	export async function load({ fetch }) {
		const url = 'https://opentdb.com/api.php?amount=5&type=multiple';
		const res = await fetch(url);
		const questions = await res.json();
		console.log(questions.results);
		if (res.ok) {
			return {
				props: {
					quiz: questions.results
				}
			};
		}
		return {
			status: res.status,
			error: new Error('Could not fetch Guides')
		};
	}
	*/
</script>

<script>
	import Header from '../lib/header.svelte';
	import { scale, slide } from 'svelte/transition';

	let quiz = [];
	let ques = [];
	let curq = -1;
	let pts;
	let over = false;
	let wrongAns = [];
	let tempBool = false;

	const beginQuiz = async () => {
		const res = await fetch(`https://opentdb.com/api.php?amount=5&type=multiple`);
		const temp = await res.json();
		console.log(temp);
		quiz = temp.results;
		curq = 0;
		pts = 0;
		quiz.forEach((el) => {
			let cur = [el.correct_answer, ...el.incorrect_answers];
			const rand = Math.floor(Math.random() * 3) + 1;
			[cur[0], cur[rand]] = [cur[rand], cur[0]];
			ques.push([cur]);
		});
		console.log(ques);
	};

	const finishQuiz = () => {
		over = true;
	};

	const answer = (ans) => {
		if (ans === quiz[curq].correct_answer) pts++;
		else wrongAns.push([quiz[curq].question, quiz[curq].correct_answer]);

		if (curq === 4) finishQuiz();
		else curq++;
	};
</script>

<div class="page">
	<Header />
	<div class="quiz">
		{#if curq == -1}
			<div class="startBox" in:slide>
				<h2 style="color: #00CC99; margin-top:0;">Instructions:</h2>
				<p>1.There Would be 5 questions</p>
				<p>2.Each question is Worth 1 Point</p>
				<p>3.There Would be No Negative Marking.</p>
				<p>4.The Quiz would be a multichoice</p>
				<p>5.All questions would have Random Difficulty and Topic</p>
				<hr />
				<h5>Powered By <a href="https://opentdb.com/" target="_blank">OpenTDB API</a></h5>
				<div class="startButton">
					<button on:click={beginQuiz}>Start Quiz</button>
				</div>
			</div>
		{:else if over}
			<div class="score" in:scale>
				<h2 class="points">You Scored {pts} / 5 Points</h2>
				{#if pts == 5}
					<!-- svelte-ignore a11y-img-redundant-alt -->
					<img
						height="250px"
						width="250px"
						src="https://cdn-icons-png.flaticon.com/512/744/744922.png"
						alt="Gold Medal Image"
					/>
					<h2 class="congo">Congrats</h2>
				{:else}
					<h2 style="color:crimson;">Wrong Answers:</h2>
					<div class="wrongBox">
						{#each wrongAns as x}
							<h3>{@html x[0]}: <br /></h3>
							<h3 class="ans">Ans: {@html x[1]}</h3>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<div class="quizStart">
				<div class="questionBox" in:slide class:no={tempBool}>
					<h2>{@html quiz[curq].question}</h2>
					{#each ques[curq][0] as i}
						<h3
							on:click={() => {
								tempBool = true;
								answer(i);
								tempBool = false;
							}}
						>
							{i}
						</h3>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	* {
		font-family: 'Ubuntu', sans-serif;
		color: whitesmoke;
	}
	.page {
		background-color: #2a2a2a;
		min-height: 100vh;
	}
	.quiz {
		display: flex;
		justify-content: center;
		height: 100%;
	}
	.no {
		display: none;
	}
	.startBox {
		margin-top: 10vh;
		background-color: rgb(66, 66, 66);
		padding: 1em;
		font-size: larger;
		border-radius: 10px;
		max-width: 95vw;
		width: 600px;
		box-sizing: border-box;
	}
	.startBox > p {
		margin: 1em 0.5em;
	}
	.startButton {
		display: flex;
		justify-content: center;
		width: 100%;
		font-size: larger;
	}
	.startButton > button {
		min-width: max-content;
		width: 40%;
		background: #00a47b;
		border: none;
		padding: 0.3em 0.1em;
		font-size: larger;
		font-weight: bolder;
		color: #b8fae9;
		border-radius: 5px;
	}
	hr {
		margin: 1em 0.5em;
		color: #bae3d8;
	}
	.questionBox {
		background-color: rgb(66, 66, 66);
		width: 800px;
		max-width: 90vw;
		padding: 0.5em 1.5em;
		border-radius: 10px;
		box-sizing: border-box;
		margin-top: 10vh;
	}
	.questionBox > h2 {
		color: #00a47b;
		padding-bottom: 20px;
		border-bottom: 3px solid #b0d2ca;
	}
	.questionBox > h3 {
		color: #bae3d8;
		align-self: center;
		cursor: default;
	}
	.score {
		background-color: rgb(66, 66, 66);
		width: 800px;
		max-width: 90vw;
		padding: 0.5em 1.5em;
		border-radius: 5px;
		box-sizing: border-box;
		margin-top: 10vh;
	}
	.points {
		color: #7ecab7;
		font-size: xx-large;
	}
	.ans {
		color: rgb(140, 208, 206);
	}
	.wrongBox {
		overflow-y: scroll;
		max-height: 25vh;
	}
	.congo {
		color: #ffdc71;
		font-weight: bolder;
		font-size: 5em;
		text-align: center;
		margin: 0;
	}
	img {
		text-align: center;
		display: block;
		margin-left: auto;
		margin-right: auto;
	}
	@media screen and (max-width: 500px) {
		.startButton > button {
			font-size: 1em;
			width: 50%;
		}
	}
</style>
