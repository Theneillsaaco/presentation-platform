<script lang="ts">
    import { theme, toggleTheme } from "@/lib/stores/theme";
    import Switch from "@/components/ui/Switch.svelte";
  
    let wrapper: HTMLElement | undefined = $state();
  
    function handleChange() {
        const rect = wrapper?.getBoundingClientRect();
        const origin = rect
          ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
          : undefined;
        toggleTheme(origin);
    }
</script>

<div bind:this={wrapper} class="flex items-center gap-3">
    <span class="font-mono text-label-medium text-md-on-surface-variant">
        {$theme === "dark" ? "oscuro" : "claro"}
    </span>
    
    <Switch
        checked={$theme === "light"}
        label="Cambiar entre tema claro y oscuro"
        onchange={handleChange}
    />
</div>
