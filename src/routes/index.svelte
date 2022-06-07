<script lang="ts">
	import Lives from '$lib/components/Lives.svelte';
	import setupGame from '$lib/setupGame';
	import { highScore, score, isGameOver, lives, isGameStarted } from '$lib/stores';
	import { fade } from 'svelte/transition';
</script>

<div class="my-2 inline-flex w-full justify-between text-lg">
	<h2>SCORE: {$score}</h2>
	<h2>HIGHSCORE: {$highScore}</h2>
</div>
<div class="relative">
	{#if !$isGameStarted}
		<section class="absolute inset-0 grid grid-rows-3 place-items-center">
			<div class="flex flex-col items-center">
				<h2 class="mb-5 text-xl">Play the Game</h2>
				<button on:click={() => setupGame()}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="transition-color h-20 w-20 duration-300 hover:text-primary"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
			<div class="row-span-2 space-y-2">
				<h3><kbd class="kbd">space</kbd> to shoot</h3>
				<h3><kbd class="kbd">w</kbd> to go forward</h3>
				<h3><kbd class="kbd">a</kbd> to rotate left</h3>
				<h3><kbd class="kbd">d</kbd> to rotate right</h3>
				<p class="text-sm">
					you can also change<br />
					the settings of the game
					<a class="link decoration-wavy hover:text-primary" href="/config">here</a>
				</p>
			</div>
		</section>
	{/if}
	{#if $isGameOver}
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 transform">
			<span class="text-3xl text-primary">GAME OVER</span>
		</div>
	{/if}
	<canvas
		class="rounded-box border-2 border-primary bg-neutral shadow-md shadow-red-600/50"
		height="460"
		width="640"
		id="game"
	/>
</div>
<div class="my-5 inline-flex w-full items-center justify-between">
	<a class="btn border-2 border-primary" sveltekit:reload href="/">RESET GAME</a>
	{#if $lives > 0}
		<ul out:fade={{ duration: 1000 }} class="rounded-box inline-flex bg-neutral py-3 px-5">
			{#each Array($lives) as lv, i (i)}
				<li>
					<Lives />
				</li>
			{/each}
		</ul>
	{/if}
</div>
