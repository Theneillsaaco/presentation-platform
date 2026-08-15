<script lang="ts">
    interface Props {
        variant?: "elevated" | "outlined" | "filled"
        class?: string;
        children?: import("svelte").Snippet;
    }

    let { variant = "elevated", class: className = "", children }: Props = $props();

    const variants: Record<string, string> = {
        elevated: "bg-md-surface-container-low shadow-[var(--md-elevation-1)]",
        filled: "bg-md-surface-container-highest",
        outlined: "bg-md-surface border border-md-outline-variant",
    };
</script>

<div class="rounded-md-lg p-6 {variants[variant]} {className}">
    {@render children?.()}
</div>