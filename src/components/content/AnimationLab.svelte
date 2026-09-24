<script lang="ts">
  import Chip from "@/components/ui/Chip.svelte";
  import { animations, staggerDelay, type AnimationName } from "@/lib/animations/core";
  import { slideActive } from "@/lib/reveal/active";

  type Name = Exclude<AnimationName, "none">;
  const names = Object.keys(animations) as Name[];

  let stage: HTMLElement | undefined = $state();
  let current: Name = $state("fade");
  let wasActive = false;

  // Same registry the slides use (slides.yaml `animation:`), so this is the real thing.
  function play(name: Name) {
    current = name;
    if (!stage) return;
    const def = animations[name];
    const targets = name === "stagger" ? (Array.from(stage.children) as HTMLElement[]) : [stage];
    for (const el of [stage, ...stage.children]) (el as HTMLElement).getAnimations().forEach((a) => a.cancel());
    targets.forEach((el, i) =>
      el.animate(def.keyframes, { ...def.options, delay: name === "stagger" ? staggerDelay(i, 110) : 0 }),
    );
  }

  function onActive(active: boolean) {
    if (active && !wasActive) queueMicrotask(() => play(current));
    wasActive = active;
  }
</script>

<div class="flex w-full flex-col gap-6" use:slideActive={onActive}>
  <div class="flex flex-wrap gap-2">
    {#each names as n (n)}
      <Chip selected={current === n} onclick={() => play(n)}>{n}</Chip>
    {/each}
  </div>

  <div
    bind:this={stage}
    class="grid grid-cols-3 gap-4 rounded-md-lg border border-md-outline-variant bg-md-surface-container-low p-6"
  >
    {#each ["Física", "Motor", "Geometría"] as layer, i (layer)}
      <div class="rounded-md-md bg-md-primary-container p-5 text-md-on-primary-container">
        <div class="font-mono text-label-small opacity-70">capa {i + 1}</div>
        <div class="mt-1 text-title-large font-semibold">{layer}</div>
      </div>
    {/each}
  </div>
</div>
