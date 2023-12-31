<script lang="ts">
	import { DebounceStore } from "$lib/debounce";
	import { SwipeHandler } from "$lib/swipeHandler";
	import { parseCrochetPattern, type CrochetPattern, rowLength } from "$lib/types";

  let text = new DebounceStore("", 500);

  let error: string | null = null;

  let parsed: CrochetPattern | null = null;

  let progress = 0;

  const swipeHandler = new SwipeHandler();
  
  swipeHandler.registerSwipeLeft(() => {
    console.log("swipe left");
    if (progress > 0) {
      navigator.vibrate(50);
      progress -= 1;
    }
  });

  swipeHandler.registerSwipeRight(() => {
    console.log("swipe right");
    if (parsed === null) return;
    if (progress < parsed.total_stitches){
      navigator.vibrate(30);
      progress += 1;
    }
  });

  // swipeHandler.registerPress(() => {
  //   console.log("press");
  //   if (parsed === null) return;
  //   if (progress < parsed.total_stitches){
  //     navigator.vibrate(30);
  //     progress += 1;
  //   }
  // });

  $: try {
    if ($text === "") {
      error = null;
      parsed = null;
    } else {
      parsed = parseCrochetPattern($text);
      error = null;
    }
  } catch (e) {
    if (e instanceof Error) {
      error = e.message;
    }
    if (typeof e === 'object' && e !== null && 'toString' in e) {
      error = e.toString();
    }
  }

  function processKeyDown(event: KeyboardEvent) {
    if (parsed === null) return;
    switch (event.key) {
      case " ":
      case "x":
      case "ArrowRight":
        if (progress < parsed.total_stitches)
          progress += 1;
        break;
      case "Backspace":
      case "ArrowLeft":
        if (progress > 0)
          progress -= 1;
        break;
      case "r":
        progress = 0;
        break;
    }
  }
</script>

<svelte:document
	on:keydown={processKeyDown}
	on:touchstart={(e) => swipeHandler.onTouchStart(e)}
	on:touchend={(e) => swipeHandler.onTouchEnd(e)}
/>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
	<h1 class="text-4xl font-bold text-center text-blue-500 mb-5">Crochet Buddy</h1>
	<input
		bind:value={$text}
		class="mb-5 p-2 border border-gray-300 rounded"
		placeholder="Enter your pattern..."
	/>

	{#if error !== null}
		<div class="text-red-500">{error}</div>
	{/if}

	<div class="flex items-start flex-col gap-2">
		<div>
			<kbd class="kbd kbd-sm">␣</kbd> (or swipe right) to go next
		</div>
		<div>
			<kbd class="kbd kbd-sm">←</kbd> (or swipe left) to go back
		</div>
		<div>
      <kbd class="kbd kbd-sm">r</kbd> to reset
    </div>
	</div>
	{#if parsed !== null}
		<div
			class="mt-5 bg-gray-200 p-5 rounded-lg shadow-md flex flex-col items-center justify-center"
		>
			<div>
				Overall progress: {progress} / {parsed.total_stitches}
			</div>
			<div class="flex flex-col">
				{#each parsed.rows as row, i}
					<div
						class="grid gap-1"
						style="grid-template-columns: repeat({rowLength(row)}, minmax(0, 1fr));"
					>
						{#each row as stitch, j}
							<div
								class="flex items-center justify-center border-b-2 border-gray-300"
								style="grid-area: span 1 / span {stitch.num_stitches};"
							>
								{#each [...Array(stitch.num_stitches).keys()] as k}
									<span class="font-mono text-2xl"
										>{i * rowLength(parsed.rows[0]) + j + k < progress ? "x" : "_"}</span
									>
								{/each}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>


<style>
  :global(body) {
    overscroll-behavior: none;
  }
</style>