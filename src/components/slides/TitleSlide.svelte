<script lang="ts">
  import type { TitleSlideData } from "@/lib/content/types";
  import AnimatedCard from "@/components/ui/AnimatedCard.svelte";

  interface Props {
    slide: TitleSlideData;
  }
  let { slide }: Props = $props();
</script>

<div class="flex h-full flex-col justify-center gap-4 px-20">
    <AnimatedCard animation={slide.animation ?? "fade"}>
        {#if slide.eyebrow}
            <p class="font-mono text-sm uppercase tracking-[0.2em] text-md-primary">
                {slide.eyebrow}
            </p>
        {/if}
        
        <h1 class="mt-3 text-6xl font-semibold text-md-on-surface">
            {slide.title}
        </h1>
            
        {#if slide.subtitle}
            <p class="mt-4 max-w-2xl text-xl text-md-on-surface-variant">
                {slide.subtitle}
            </p>
        {/if}
    </AnimatedCard>
</div>
