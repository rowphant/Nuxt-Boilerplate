import { ref, onMounted } from "vue";

export function useTheme() {
  const theme = ref('light');

  const setTheme = (newTheme) => {
    theme.value = newTheme;
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  onMounted(() => {
    const userMode = window?.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const savedTheme = localStorage?.getItem("theme") || userMode || "light";
    setTheme(savedTheme);
  });

  return { theme, setTheme };
}
