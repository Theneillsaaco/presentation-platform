<script lang="ts">
    import type { VideoSlideData } from "@/lib/content/types";
  
    interface Props {
        slide: VideoSlideData;
        src: string;
        poster?: string;
    }
    
    let { slide, src, poster }: Props = $props();
</script>

<div class="flex h-full flex-col gap-4 px-16 py-12">
    {#if slide.title}
        <h2 class="text-3xl font-semibold text-md-on-surface">{slide.title}</h2>
    {/if}
    
    <div class="flex flex-1 items-center justify-center overflow-hidden rounded-md-lg bg-black">
        <!-- svelte-ignore a11y_media_has_caption -->
        <video
            {src}
            {poster}
            autoplay={slide.autoplay ?? false}
            loop={slide.loop ?? false}
            controls
            class="max-h-full max-w-full"
        ></video>
    </div>
</div>
