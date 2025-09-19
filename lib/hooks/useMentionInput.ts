// hooks/useMentionInput.ts
import { useCallback, useMemo, useRef, useState } from 'react';
import type { MentionOption } from '../types/MentionInput.types';

type UseMentionInputReturn = {
  input: string;
  mentionQuery: string;
  showMenu: boolean;
  activeIndex: number;
  filteredOptions: MentionOption[];
  unselectedOptions: MentionOption[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  handleSelect: (opt: MentionOption) => void;
  handleRemove: (value: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setActiveIndex: (i: number) => void;
};

export function useMentionInput(
  options: MentionOption[],
  value: string[],
  onChange: (next: string[]) => void
): UseMentionInputReturn {
  const [input, setInput] = useState('');
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unselectedOptions = useMemo(
    () => options.filter((o) => !value.includes(o.value)),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    if (!mentionQuery) return unselectedOptions;
    const q = mentionQuery.toLowerCase();
    return unselectedOptions.filter((o) => {
      const label = (o.label ?? o.value).toString().toLowerCase();
      return label.includes(q) || o.value.toLowerCase().includes(q);
    });
  }, [mentionQuery, unselectedOptions]);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
    setMentionQuery('');
    setActiveIndex(0);
  }, []);

  const handleRemove = useCallback(
    (val: string) => {
      onChange(value.filter((v) => v !== val));
    },
    [onChange, value]
  );

  const insertMentionToken = useCallback((opt: MentionOption) => {
    const el = inputRef.current;
    if (!el) {
      // fallback: append token and update selected values
      setInput("");
      onChange([...value, opt.value]);
      return;
    }

    const cursor = el.selectionStart ?? el.value.length;
    // find last @ before cursor which starts a mention
    const text = el.value;
    const lastAt = text.lastIndexOf('@', cursor - 1);

    if (lastAt === -1) {
      // just append
      setInput("");
      onChange([...value, opt.value]);
      // move caret after inserted token
      window.requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(cursor + opt.value.length + 2, cursor + opt.value.length + 2);
      });
      return;
    }

    // Replace the @query with the resolved mention token
    // include trailing space after mention for convenience
    const before = text.slice(0, lastAt);
    setInput("");
    onChange([...value, opt.value]);

    // put caret after inserted token
    window.requestAnimationFrame(() => {
      el.focus();
      const pos = before.length + opt.value.length + 2;
      el.setSelectionRange(pos, pos);
    });
  }, [onChange, value]);

  const handleSelect = useCallback(
    (opt: MentionOption) => {
      insertMentionToken(opt);
      closeMenu();
    },
    [insertMentionToken, closeMenu]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const el = e.target;
      const val = el.value;
      setInput(val);

      const cursor = el.selectionStart ?? val.length;

      // find last @ before cursor
      const lastAt = val.lastIndexOf('@', cursor - 1);
      if (lastAt === -1) {
        closeMenu();
        return;
      }

      // ensure '@' is at start or preceded by whitespace
      const charBefore = lastAt > 0 ? val[lastAt - 1] : ' ';
      if (charBefore !== ' ' && charBefore !== '\n' && charBefore !== '\t') {
        closeMenu();
        return;
      }

      const q = val.slice(lastAt + 1, cursor);
      setMentionQuery(q);
      setShowMenu(true);
      setActiveIndex(0);
    },
    [closeMenu]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMentionQuery(e.target.value);
    setActiveIndex(0);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle backspace for removing selected values when input is empty
      if (e.key === 'Backspace') {
        if (input.trim() === '' && value.length > 0) {
          e.preventDefault();
          // Remove the last selected value
          const newValue = [...value];
          newValue.pop();
          onChange(newValue);
          return;
        }
      }

      if (!showMenu) {
        // only open on "@"
        if (e.key === '@') {
          // let the "@" be entered; show menu will be triggered via onChange handler
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(0, filteredOptions.length - 1)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const opt = filteredOptions[activeIndex];
        if (opt) {
          handleSelect(opt);
        } else {
          closeMenu();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
      }
    },
    [input, value, onChange, showMenu, filteredOptions, activeIndex, handleSelect, closeMenu]
  );

  return {
    input,
    mentionQuery,
    showMenu,
    activeIndex,
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