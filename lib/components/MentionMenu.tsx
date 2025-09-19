// components/MentionMenu.tsx
import React, { useEffect, useRef, useState } from 'react';
import { classNames, getCaretCoordinates, calculateDropdownPosition } from '../utils/MentionInput.utils';
import type { MentionOption } from '../types/MentionInput.types';

type MentionMenuProps = {
  inputRef: React.RefObject<HTMLInputElement>;
  options: MentionOption[];
  activeIndex: number;
  mentionQuery: string;
  show: boolean;
  onSelect: (opt: MentionOption) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setActiveIndex: (i: number) => void;
  customClassNames: Record<string, string>;
  DropdownItemComponent: React.FC<any>;
  dropdownWidth?: number;
  dropdownHeight?: number;
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
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 8, y: 8 });

  // Recalculate dropdown position
  const updatePosition = () => {
    const el = inputRef.current;
    const menuEl = menuRef.current;
    if (!el) return;

    const caretPos = el.selectionStart ?? (el as any).value.length;
    const caret = getCaretCoordinates(el, caretPos); // viewport coords
    const inputRect = el.getBoundingClientRect();

    // caretOffset relative to inputRect.left
    const caretOffset = Math.max(0, caret.x - inputRect.left);

    // If menu element exists we can try to read its measured size
    const measuredWidth = menuEl ? Math.max(dropdownWidth, menuEl.offsetWidth || 0) : dropdownWidth;
    const measuredHeight = menuEl ? Math.max(dropdownHeight, menuEl.offsetHeight || 0) : dropdownHeight;

    const pos = calculateDropdownPosition(inputRect, caretOffset, measuredWidth, measuredHeight);
    setCoords(pos);
  };

  // Update position when shown and add listeners for scroll/resize/selectionchange
  useEffect(() => {
    if (!show) return;

    updatePosition();

    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    const onSelectionChange = () => updatePosition();

    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    document.addEventListener('selectionchange', onSelectionChange);

    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('selectionchange', onSelectionChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, options.length, mentionQuery]);

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
        maxHeight: `${dropdownHeight}px`,
        overflow: 'hidden',
      }}
      role="dialog"
      aria-hidden={!show}
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
        style={{ overflowY: 'auto', maxHeight: `${dropdownHeight - 48}px` }} // leave space for search input
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
