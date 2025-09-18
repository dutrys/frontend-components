import { useState, useEffect } from "react";

export class ScreenSize {
  static readonly none: number = 0;
  static readonly xs: number = 1;
  static readonly sm: number = 2;
  static readonly md: number = 3;
  static readonly lg: number = 4;
  static readonly xl: number = 5;
}

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<number>(ScreenSize.none);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize(ScreenSize.xs);
      } else if (window.innerWidth >= 640 && window.innerWidth < 768) {
        setScreenSize(ScreenSize.sm);
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setScreenSize(ScreenSize.md);
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        setScreenSize(ScreenSize.lg);
      } else if (window.innerWidth >= 1280 && window.innerWidth < 1536) {
        setScreenSize(ScreenSize.xl);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};
