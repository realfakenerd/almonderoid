<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { goto } from '$app/navigation';
	import { keyStore } from '$lib/stores';
	const keys = $state({
		forwardKey: '',
		leftKey: '',
		rightKey: '',
		shootKey: ''
	});

	function setKey() {
		keyStore.set({
			forwardKey: keys.forwardKey,
			leftKey: keys.leftKey,
			rightKey: keys.rightKey,
			shootKey: keys.shootKey
		});
		goto('/');
	}
</script>

<div class="w-1/2 mx-auto flex flex-col items-center">
	<form class="space-y-2" onsubmit={preventDefault(setKey)}>
		<section class="form-control">
			<label class="label" for="left">
				<span class="label-text">left key</span>
			</label>
			<div class="input-group">
				<input class="input input-bordered" bind:value={keys.leftKey} id="left" type="text" />
				<span class="transition-colors duration-300 {keys.leftKey ? 'bg-secondary' : 'bg-neutral'}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
			</div>
		</section>
		<section class="form-control">
			<label class="label" for="forward">
				<span class="label-text">forward key</span>
			</label>
			<div class="input-group">
				<input class="input input-bordered" bind:value={keys.forwardKey} id="forward" type="text" />
				<span
					class="transition-colors duration-300 {keys.forwardKey ? 'bg-secondary' : 'bg-neutral'}"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
			</div>
		</section>
		<section class="form-control">
			<label class="label" for="right">
				<span class="label-text">right key</span>
			</label>
			<div class="input-group">
				<input class="input input-bordered" bind:value={keys.rightKey} id="right" type="text" />
				<span
					class="transition-colors duration-300 {keys.rightKey ? 'bg-secondary' : 'bg-neutral'}"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
			</div>
		</section>
		<section class="form-control">
			<label class="label" for="shoot">
				<span class="label-text">shoot key</span>
			</label>
			<div class="input-group">
				<input class="input input-bordered" bind:value={keys.shootKey} id="shoot" type="text" />
				<span
					class="transition-colors duration-300 {keys.shootKey ? 'bg-secondary' : 'bg-neutral'}"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
			</div>
		</section>
		<button class="btn btn-secondary btn-block">save</button>
	</form>
</div>
