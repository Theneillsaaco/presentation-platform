<script lang="ts">
  import Chip from "@/components/ui/Chip.svelte";
  import { presentationState, patchPresentation } from "@/lib/stores/presentation";
  import { theme, toggleTheme } from "@/lib/stores/theme";
  import { slideManager } from "@/lib/reveal/navigation";

  let visible = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  function wake() {
    visible = true;
    clearTimeout(timer);
    timer = setTimeout(() => (visible = false), 2500);
  }

  $effect(() => {
    const onFullscreen = () => patchPresentation({ isFullScreen: !!document.fullscreenElement });
    window.addEventListener("mousemove", wake);
    window.addEventListener("touchstart", wake, { passive: true });
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("touchstart", wake);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  });

  // Chips take focus on click; hand it back so arrow keys / space keep driving Reveal.
  const act = (fn: (e: MouseEvent) => void) => (e: MouseEvent) => {
    fn(e);
    (e.currentTarget as HTMLElement).blur();
  };

  const toggleFullscreen = () =>
    document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
</script>

<div
  class="fixed bottom-4 left-4 z-50 flex items-center gap-2 transition-opacity duration-300"
  class:opacity-0={!visible}
  class:pointer-events-none={!visible}
  role="toolbar"
  aria-label="Controles de la presentación"
>
  <Chip onclick={act((e) => toggleTheme({ x: e.clientX, y: e.clientY }))}>
    Tema: {$theme === "dark" ? "oscuro" : "claro"}
  </Chip>
  <Chip selected={$presentationState.isOverview} onclick={act(() => slideManager.toggleOverview())}>
    Vista general
  </Chip>
  <Chip onclick={act(() => slideManager.openNotes())}>Notas</Chip>
  <Chip selected={$presentationState.isFullScreen} onclick={act(toggleFullscreen)}>
    Pantalla completa
  </Chip>
</div>
