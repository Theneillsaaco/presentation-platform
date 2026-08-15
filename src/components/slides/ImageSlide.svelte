<script lang="ts">
    import type { ImageSlideData } from "@/lib/content/types";
    import AnimatedCard from "@/components/ui/AnimatedCard.svelte";
  
    interface Props {
        slide: ImageSlideData;
        src: string;
    }
    let { slide, src }: Props = $props();
</script>

<div class="flex h-full flex-col gap-4 px-16 py-12">
    {#if slide.title}
        <h2 class="text-3xl font-semibold text-md-on-surface">
            {slide.title}
        </h2>
    {/if}
    
    <AnimatedCard animation={slide.animation ?? "zoom"} class="flex flex-1 items-center justify-center overflow-hidden rounded-md-lg bg-md-surface-container-low">
        <img src={src} alt={slide.alt ?? slide.title ?? ""} class="max-h-full max-w-full object-contain" />
    </AnimatedCard>
    
    {#if slide.caption}
        <p class="font-mono text-sm text-md-on-surface-variant">
            {slide.caption}
        </p>
    {/if}
</div>
