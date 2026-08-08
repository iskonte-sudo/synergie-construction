import { useRef, useCallback } from 'react';

/**
 * Safe modal backdrop-close guard.
 *
 * The classic "click outside to close" using onClick has a bug: when the native
 * file picker opens (via <input type="file"> inside a <label>), closing the OS
 * dialog can dispatch a click on the backdrop, closing the modal accidentally.
 *
 * This guard only closes the modal when BOTH the mousedown AND the click were
 * dispatched on the backdrop element itself (target === currentTarget) — not
 * on any child.
 *
 * Usage:
 *   const backdrop = useBackdropCloseGuard(onClose);
 *   <div className="fixed inset-0 ..." {...backdrop}>
 *     <div onClick={(e) => e.stopPropagation()}>modal content</div>
 *   </div>
 */
export default function useBackdropCloseGuard(onClose) {
  const mouseDownOnBackdrop = useRef(false);

  const onMouseDown = useCallback((e) => {
    mouseDownOnBackdrop.current = e.target === e.currentTarget;
  }, []);

  const onClick = useCallback((e) => {
    if (mouseDownOnBackdrop.current && e.target === e.currentTarget) {
      onClose();
    }
    mouseDownOnBackdrop.current = false;
  }, [onClose]);

  return { onMouseDown, onClick };
}
