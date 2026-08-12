import { useEffect } from "react";

// Adds .is-visible to any element with .reveal when it enters viewport.
export default function useScrollReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.is-visible)");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
