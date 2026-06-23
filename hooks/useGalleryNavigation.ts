import { useCallback, useEffect } from "react";

interface UseGalleryNavigationProps {
  totalItems: number;
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}

export function useGalleryNavigation({
  totalItems,
  currentIndex,
  onNext,
  onPrevious,
  onClose,
}: UseGalleryNavigationProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrevious();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [onNext, onPrevious, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
