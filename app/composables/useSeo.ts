export const useSeo = ({ title }: { title?: string }) => {
  const seoTitle = title
    ? title + " – " + useGlobals().siteName.value
    : useGlobals().siteName.value;

  useHead({
    title: seoTitle,
  });
};
