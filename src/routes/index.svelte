<script lang="ts">
	import setupGame, { highScore, score, finishedLoading } from "$lib/setupGame";

</script>

<div class="score-container">
	<h2>SCORE: {$score}</h2>
	<h2>HIGHSCORE: {$highScore}</h2>
</div>
<div class="game-container">
	<canvas class:border={$finishedLoading} height="460" width="640" use:setupGame id="game" />
</div>
<a sveltekit:reload href="/">RESET GAME</a>
<style>
	a {
		text-decoration: none;
		background: black;
		color: white;
		border: 1px solid white;
		padding: 1rem 1.250rem;
	}
	.score-container {
		color: white;
		font-size: 21px;
		display: inline-flex;

	}
	.score-container > h2 {
		margin: auto 1rem;
	}
	.game-container {
		max-width: 1400px;
		margin: auto;
		margin-bottom: 20px;
	}
	.border{
		border:1px solid white;
	}
	canvas {
		background-color: black;
	}
</style>
