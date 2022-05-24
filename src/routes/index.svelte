<script lang="ts">
	import Lives from '$lib/Lives.svelte';
	import setupGame,{ isGameOver,lives } from '$lib/setupGame';
	import { highScore,score } from '$lib/stores/score';
	import { fade } from 'svelte/transition';
</script>

<div class="inline-flex justify-between w-full text-lg my-2">
	<h2>SCORE: {$score}</h2>
	<h2>HIGHSCORE: {$highScore}</h2>
</div>
<div class="relative">
	{#if $isGameOver}
		<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2">
			<span class="text-3xl text-primary">GAME OVER</span>
		</div>
	{/if}
	<canvas
		class="border-2 border-primary bg-neutral rounded-box shadow-md shadow-red-600/50"
		height="460"
		width="640"
		use:setupGame
		id="game"
	/>
</div>
<div class="inline-flex justify-between items-center w-full my-5">
	<a class="btn border-2 border-primary" sveltekit:reload href="/">RESET GAME</a>
	{#if $lives > 0}
		<ul transition:fade={{ duration: 1000 }} class="inline-flex py-3 px-5 rounded-box bg-neutral">
			{#each Array($lives) as lv, i (i)}
				<li>
					<Lives />
				</li>
			{/each}
		</ul>
	{/if}
</div>
