// components/MentionMenu.tsx
import React, { useEffect, useRef, useState } from 'react';
import { classNames, getCaretCoordinates } from '../utils/MentionInput.utils';
import type { MentionOption } from '../types/MentionInput.types';

type MentionMenuProps = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  options: MentionOption[];
  activeIndex: number;
  mentionQuery: string;
  show: boolean;
  onSelect: (opt: MentionOption) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setActiveIndex: (i: number) => void;
  customClassNames: Record<string, string>;
  DropdownItemComponent: React.FC<{
    option: MentionOption;
    isActive: boolean;
    onSelect: () => void;
    className?: string;
  }>;
  dropdownWidth?: number;
  dropdownHeight?: number;
  onClose?: () => void; // Add onClose callback
};

export const MentionMenu: React.FC<MentionMenuProps> = ({
  inputRef,
  options,
  activeIndex,
  mentionQuery,
  show,
  onSelect,
  onSearchChange,
  setActiveIndex,
  customClassNames,
  DropdownItemComponent,
  dropdownWidth = 280,
  dropdownHeight = 300,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // start offscreen so it never visibly snaps to top-left
  const [coords, setCoords] = useState({ x: -9999, y: -9999 });
  const [isPositioned, setIsPositioned] = useState(false);

  // Recalculate dropdown position with better positioning logic
  const updatePosition = () => {
    const el = inputRef.current;
    const menuEl = menuRef.current;
    if (!el) return;

    const caretPos = el.selectionStart ?? (el as HTMLInputElement).value.length;
    const caret = getCaretCoordinates(el, caretPos); // viewport coords
    const inputRect = el.getBoundingClientRect();

    // caretOffset relative to inputRect.left
    const caretOffset = Math.max(0, caret.x - inputRect.left);

    // If menu element exists, prefer its measured size
    const measuredWidth = menuEl ? Math.max(dropdownWidth, menuEl.offsetWidth || 0) : dropdownWidth;
    const measuredHeight = menuEl ? Math.max(dropdownHeight, menuEl.offsetHeight || 0) : dropdownHeight;

    // Get viewport dimensions
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Horizontal position
    let x = inputRect.left + caretOffset;
    if (x + measuredWidth > viewportWidth) {
      x = Math.max(8, viewportWidth - measuredWidth - 8); // clamp to screen
    }

    // Available space
    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;

    // Final dropdown height
    let finalHeight = measuredHeight;
    let y: number;

    if (spaceBelow >= measuredHeight) {
      // Enough space below
      y = inputRect.bottom + 4;
    } else if (spaceAbove >= measuredHeight) {
      // Enough space above
      y = inputRect.top - measuredHeight - 4;
    } else if (spaceBelow >= spaceAbove) {
      // Not enough space → shrink below
      finalHeight = Math.max(100, spaceBelow - 8);
      y = inputRect.bottom + 4;
    } else {
      // Not enough space → shrink above
      finalHeight = Math.max(100, spaceAbove - 8);
      y = inputRect.top - finalHeight - 4;
    }

    // Clamp vertically
    if (y < 8) y = 8;
    if (y + finalHeight > viewportHeight - 8) {
      y = Math.max(8, viewportHeight - finalHeight - 8);
    }

    setCoords({ x, y });
    setIsPositioned(true);

    // Also apply new maxHeight dynamically
    if (menuEl) {
      menuEl.style.maxHeight = `${finalHeight}px`;
    }
  };


  // Handle click outside to close dropdown
  useEffect(() => {
    if (!show || !onClose) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const menuElement = menuRef.current;
      const inputElement = inputRef.current;
      console.log({ target, menuElement, inputElement })
      // Don't close if clicking on the menu itself or the input
      if (
        (menuElement && menuElement.contains(target)) ||
        (inputElement && inputElement.contains(target))
      ) {
        return;
      }

      onClose();
    };

    // Use capture phase to catch clicks before they bubble
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [show, onClose, inputRef]);

  // Update position when shown and add listeners for scroll/resize/selectionchange
  useEffect(() => {
    if (!show) {
      // hide immediately when menu is closed to avoid stale menu visible
      setIsPositioned(false);
      setCoords({ x: -9999, y: -9999 });
      return;
    }

    // Reset positioned flag and compute position on next paint to avoid flash.
    setIsPositioned(false);

    // double RAF helps ensure DOM has laid out (menuRef will be available), preventing a brief blink.
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        updatePosition();
      });

      // Return cleanup function for raf2
      return () => cancelAnimationFrame(raf2);
    });

    const onScroll = () => {
      // keep repositioning on scroll (capture phase)
      updatePosition();
    };
    const onResize = () => updatePosition();
    const onSelectionChange = () => updatePosition();

    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    document.addEventListener('selectionchange', onSelectionChange);

    return () => {
      // cancel RAFs and listeners
      cancelAnimationFrame(raf1);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('selectionchange', onSelectionChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, options.length, mentionQuery]);

  // Handle escape key to close dropdown
  useEffect(() => {
    if (!show || !onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      ref={menuRef}
      className={classNames('mention-input-dropdown', customClassNames.dropdown)}
      style={{
        position: 'fixed',
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        width: `${dropdownWidth}px`,
        overflow: 'hidden',
        // hide until positioned to prevent flicker at (0,0) or small offsets
        visibility: isPositioned ? 'visible' : 'hidden',
        pointerEvents: isPositioned ? 'auto' : 'none',
        opacity: isPositioned ? 1 : 0,
        transition: 'opacity 120ms ease',
        zIndex: 9999, // Ensure dropdown appears above other elements
      }}
      role="dialog"
      aria-hidden={!isPositioned}
    >
      {/* Search Input */}
      <input
        className={classNames('mention-input-dropdown-search', customClassNames.dropdownSearch)}
        placeholder="Search..."
        value={mentionQuery}
        onChange={onSearchChange}
        type="text"
        autoFocus
      />

      {/* Options */}
      <div
        className={classNames('mention-input-dropdown-list', customClassNames.dropdownList)}
        style={{
          overflowY: 'auto',
          // leave space for search input (48px)
          maxHeight: `calc(${menuRef.current?.style.maxHeight || dropdownHeight}px - 48px)`,
        }}
      >
        {options.length === 0 ? (
          <div className={classNames('mention-input-dropdown-empty', customClassNames.dropdownEmpty)}>
            No results found.
          </div>
        ) : (
          options.map((option, index) => (
            <div
              key={option.value}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(e) => {
                // prevent blur before click registers
                e.preventDefault();
              }}
              style={{ cursor: 'pointer' }}
            >
              <DropdownItemComponent
                option={option}
                isActive={index === activeIndex}
                onSelect={() => onSelect(option)}
                className={classNames(
                  customClassNames.dropdownItem,
                  index === activeIndex && customClassNames.dropdownItemActive
                )}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MentionMenu;