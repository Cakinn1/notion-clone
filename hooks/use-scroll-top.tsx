import { useState, useEffect } from "react";

export default function useScrollTop(threshhold = 10) {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > threshhold) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);
  return scrolled;
}
