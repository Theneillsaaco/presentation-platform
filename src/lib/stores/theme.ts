import { writable } from "svelte/store";

export type ThemeMode = "light" | "dark" 

const STORAGE_KEY = "md3-theme";

function getInitialTheme(): ThemeMode {
    if (typeof document !== "undefined") {
        const current = document.documentElement.dataset.theme;
        if (current === "light" || current === "dark") return current;
    }
    return "dark";
}

export const theme = writable<ThemeMode>(getInitialTheme());

theme.subscribe(value => {
  if (typeof document === "undefined") return;

  document.documentElement.dataset.theme = value;

  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // localStorage unavailable (private mode, etc.) — theme still applies
    // for this session, just won't persist.
  }
});

/**
 * Toggles the theme. If the browser supports the View Transitions API,
 * wraps the swap in document.startViewTransition() for an animated
 * circular reveal instead of a flat cross-fade; falls back silently
 * otherwise (global.css's `transition` on color properties still applies).
 */
export function toggleTheme(origin?: { x: number; y: number }) {
  const flip = () => {
    theme.update(t => (t === "dark" ? "light" : "dark"));
  };

  const docWithVT = document as Document & {
     startViewTransition: (cb: () => void) => { ready: Promise<void> };
  };

  if (!docWithVT.startViewTransition) {
    flip();
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const transition = docWithVT.startViewTransition(flip);

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `cicle(${endRadius}px at ${x}px ${y}px)`
        ]
      },
      {
        duration: 600,
        easing: "cubic-bezier(0.3, 0, 0.8, 0.15)", // --md-easing-emphasized
        pseudoElement: "::view-transition-new(root)",
      }
    )
  });
}