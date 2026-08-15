<script lang="ts">
    import { animations, staggerDelay, type AnimationName } from "@/lib/animations/core";

    interface Props {
        animation?: AnimationName;
        index?: number;
        as?: string;
        class?: string;
        children?: import("svelte").Snippet;
    }

    let {
        animation = "fade",
        index = 0,
        as = "div",
        class: className = "",
        children,
    }: Props = $props();

    let el: HTMLElement | undefined = $state();

    $effect(() => {
        if (!el || animation === "none") return;

        const def = animations[animation === "stagger" ? "stagger" : animation];
        if (!def) return;

        const delay = animation === "stagger" ? staggerDelay(index) : 0;

        el.animate(def.keyframes, { ...def.options, delay });
    });
</script>

<svelte:element this={as} bind:this={el} class={className}>
    {@render children?.()}
</svelte:element>