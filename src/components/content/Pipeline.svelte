<script lang="ts">
  import { slideActive } from "@/lib/reveal/active";

  interface Step {
    label: string;
    detail: string;
  }

  interface Props {
    steps: Step[];
    /** Milliseconds each step stays lit. */
    interval?: number;
  }

  let { steps, interval = 900 }: Props = $props();

  let active = $state(false);
  let lit = $state(-1);

  // The highlight loops only while the slide is on screen.
  $effect(() => {
    if (!active) {
      lit = -1;
      return;
    }
    lit = 0;
    const id = setInterval(() => (lit = (lit + 1) % (steps.length + 1)), interval);
    return () => clearInterval(id);
  });
</script>

<div class="flex w-full items-stretch gap-2" use:slideActive={(v) => (active = v)}>
  {#each steps as step, i (step.label)}
    <div
      class="flex flex-1 flex-col justify-between rounded-md-lg border p-4 transition-colors duration-300"
      class:border-md-primary={lit >= i}
      class:bg-md-primary-container={lit === i}
      class:text-md-on-primary-container={lit === i}
      class:border-md-outline-variant={lit < i}
      class:bg-md-surface-container-low={lit !== i}
    >
      <div class="font-mono text-label-medium opacity-70">{i + 1}</div>
      <div>
        <div class="text-title-medium font-semibold">{step.label}</div>
        <div class="mt-1 text-body-small opacity-80">{step.detail}</div>
      </div>
    </div>
    {#if i < steps.length - 1}
      <div class="flex items-center font-mono text-title-large transition-colors duration-300" class:text-md-primary={lit > i} class:text-md-outline-variant={lit <= i} aria-hidden="true">
        ›
      </div>
    {/if}
  {/each}
</div>
