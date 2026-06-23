import { useCallback, useEffect, useRef } from "react";

export function useScrollPosition() {
  const scrollPositionRef = useRef(0);

  const savePosition = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
  }, []);

  const restorePosition = useCallback(() => {
    window.scrollTo(0, scrollPositionRef.current);
  }, []);

  return { savePosition, restorePosition };
}
