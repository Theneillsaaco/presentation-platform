<script lang="ts">
    interface Props {
        variant?: "filled" | "outlined" | "text";
        onclick?: (e: MouseEvent) => void;
        disabled?: boolean;
        type?: "button" | "submit";
        children?: import("svelte").Snippet;
    }

    let {
        variant = "filled",
        onclick,
        disabled = false,
        type = "button",
        children,
    }: Props = $props();

    const base =
        "md-state-layer inline-flex items-center gap-2 rounded-md-full px-6 py-2.5 text-label-large font-medium " +
        "transition-shadow duration-150 ease-[cubic-bezier(0.2,0,0,1)] " +
        "disabled:opacity-38 disabled:pointer-events-none " +
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-md-primary";

    const variants: Record<string, string> = {
        filled:
            "bg-md-primary text-md-on-primary hover:shadow-[var(--md-elevation-shadow-1)] [--md-state-layer-color:var(--md-on-primary)]",
        outlined:
            "border border-md-outline text-md-on-surface [--md-state-layer-color:var(--md-on-surface)]",
        text: 
            "text-md-primary [--md-state-layer-color:var(--md-primary)]",
    };
</script>

<button {type} {disabled} {onclick} class="{base} {variants[variant]}">
    {@render children?.()}
</button>