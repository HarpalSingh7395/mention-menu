import { useState, useRef, useEffect, useCallback } from 'react';
import { type MentionOption } from '../types/MentionInput.types';
import { getCaretOffsetInInput, calculateDropdownPosition } from '../utils/MentionInput.utils';

export function useMentionInput(
  options: MentionOption[],
  value: string[],
  onChange: (values: string[]) => void
) {
  const [input, setInput] = useState('');
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on query and current selections
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(mentionQuery.toLowerCase()) &&
      !value.includes(opt.value)
  );

  const unselectedOptions = options.filter((opt) => !value.includes(opt.value));

  const handleSelect = useCallback((option: MentionOption) => {
    onChange([...value, option.value]);
    setInput('');
    setShowMenu(false);
    setMentionQuery('');
    setActiveIndex(0);
    inputRef.current?.focus();
  }, [value, onChange]);

  const handleRemove = useCallback((valueToRemove: string) => {
    onChange(value.filter((v) => v !== valueToRemove));
  }, [value, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    if (val.includes('@')) {
      const atIndex = val.lastIndexOf('@');
      const query = val.slice(atIndex + 1);
      setMentionQuery(query);
      setShowMenu(true);

      if (inputRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const caretOffset = getCaretOffsetInInput(inputRef.current, e.target.selectionStart || 0);
        const position = calculateDropdownPosition(inputRect, caretOffset);
        setDropdownPosition(position);
      }
    } else {
      setShowMenu(false);
      setMentionQuery('');
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMenu && filteredOptions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredOptions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev - 1 < 0 ? filteredOptions.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (filteredOptions[activeIndex]) {
          handleSelect(filteredOptions[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowMenu(false);
      }
    }

    if (e.key === 'Backspace' && input === '' && value.length > 0) {
      e.preventDefault();
      onChange(value.slice(0, -1));
    }
  }, [showMenu, filteredOptions, activeIndex, input, value, handleSelect, onChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMentionQuery(e.target.value);
    setActiveIndex(0);
  }, []);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  // Reset active index when filtered options change
  useEffect(() => {
    setActiveIndex(0);
  }, [filteredOptions.length]);

  return {
    input,
    mentionQuery,
    showMenu,
    activeIndex,
    dropdownPosition,
    filteredOptions,
    unselectedOptions,
    inputRef,
    dropdownRef,
    handleSelect,
    handleRemove,
    handleInputChange,
    handleKeyDown,
    handleSearchChange,
    setActiveIndex,
  };
}