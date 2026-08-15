<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { DeckMeta } from "@/lib/content/types";
    import { initReveal, destroyReveal } from "@/lib/reveal/init";
    import { assetUrl } from "@/lib/content/assets";
  
    import TitleSlide from "@/components/slides/TitleSlide.svelte";
    import ContentSlide from "@/components/slides/ContentSlide.svelte";
    import ImageSlide from "@/components/slides/ImageSlide.svelte";
    import ChartSlide from "@/components/slides/ChartSlide.svelte";
    import VideoSlide from "@/components/slides/VideoSlide.svelte";
  
    interface Props {
        deck: DeckMeta;
    }
    
    let { deck }: Props = $props();
  
    onMount(() => {
        initReveal({ deckSlug: deck.slug, totalSlides: deck.slides.length });
    });
  
    onDestroy(() => {
        destroyReveal();
    });
</script>

<div class="reveal">
    <div class="slides">
        {#each deck.slides as slide (slide.id)}
            <section data-slide-id={slide.id}>
                {#if slide.type === "title"}
                    <TitleSlide {slide} />
                {:else if slide.type === "content"}
                    <ContentSlide {slide} />
                {:else if slide.type === "image"}
                    <ImageSlide {slide} src={assetUrl(deck.slug, slide.src)} />
                {:else if slide.type === "chart"}
                    <ChartSlide {slide} />
                {:else if slide.type === "video"}
                    <VideoSlide
                        {slide}
                        src={assetUrl(deck.slug, slide.src)}
                        poster={slide.poster ? assetUrl(deck.slug, slide.poster) : undefined}
                    />
                {/if}
            </section>
        {/each}
    </div>
</div>
