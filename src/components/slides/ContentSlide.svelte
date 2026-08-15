<script lang="ts">
    import type { ContentSlideData } from "@/lib/content/types";
    import AnimatedCard from "../ui/AnimatedCard.svelte";

    interface Props {
        slide: ContentSlideData;
    }

    let { slide }: Props = $props();
</script>

<div class="flex h-full flex-col justify-center gap-6 px-20">
    {#if slide.title}   
        <h2 class="text-4xl font-semibold text-md-on-surface">
            {slide.title}
        </h2>
    {/if}
    
    {#if slide.body}
        <AnimatedCard animation={slide.animation ?? "slide"} class="max-w-3xl">
            <p class="text-xl leading-relaxed text-md-on-surface-variant">
                {slide.body}
            </p>
        </AnimatedCard>
    {/if}

    {#if slide.bullets?.length}
        <ul class="flex max-w-3xl flex-col gap-3">
            {#each slide.bullets as bullet, i (bullet)}
                <AnimatedCard as="li" animation="stagger" index={i} class="flex items-start gap-3">
                    <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-md-primary"></span>
                    <span class="text-xl text-md-on-surface-variant">
                        {bullet}
                    </span>
                </AnimatedCard>
            {/each}
        </ul>
    {/if}
</div>