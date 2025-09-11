import { renderHook, act } from '@testing-library/react';
import { useMentionInput } from '../hooks/useMentionInput';
import { type MentionOption } from '../types/MentionInput.types';

const mockOptions: MentionOption[] = [
  { value: '1', label: 'John Doe' },
  { value: '2', label: 'Jane Smith' },
  { value: '3', label: 'Bob Johnson' },
];

describe('useMentionInput', () => {
  const defaultArgs = {
    options: mockOptions,
    value: [],
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useMentionInput(
      defaultArgs.options,
      defaultArgs.value,
      defaultArgs.onChange
    ));

    expect(result.current.input).toBe('');
    expect(result.current.mentionQuery).toBe('');
    expect(result.current.showMenu).toBe(false);
    expect(result.current.activeIndex).toBe(0);
  });

  it('filters options correctly', () => {
    const { result } = renderHook(() => useMentionInput(
      defaultArgs.options,
      defaultArgs.value,
      defaultArgs.onChange
    ));

    expect(result.current.filteredOptions).toEqual(mockOptions);
    expect(result.current.unselectedOptions).toEqual(mockOptions);
  });

  it('excludes selected values from filtered options', () => {
    const { result } = renderHook(() => useMentionInput(
      defaultArgs.options,
      ['1'], // John Doe is selected
      defaultArgs.onChange
    ));

    expect(result.current.filteredOptions).toEqual([
      { value: '2', label: 'Jane Smith' },
      { value: '3', label: 'Bob Johnson' },
    ]);
  });

  it('handles input change without @', () => {
    const { result } = renderHook(() => useMentionInput(
      defaultArgs.options,
      defaultArgs.value,
      defaultArgs.onChange
    ));

    const mockEvent = {
      target: { value: 'hello', selectionStart: 5 },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleInputChange(mockEvent);
    });

    expect(result.current.input).toBe('hello');
    expect(result.current.showMenu).toBe(false);
    expect(result.current.mentionQuery).toBe('');
  });

  it('handles input change with @', () => {
    // Mock getBoundingClientRect for the input
    const mockGetBoundingClientRect = jest.fn(() => ({
      x: 100,
      y: 100,
      width: 200,
      height: 30,
      top: 100,
      left: 100,
      right: 300,
      bottom: 130,
      toJSON: () => ({}),
    }));

    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    Object.defineProperty(window, 'innerHeight', { value: 768 });

    const { result } = renderHook(() => useMentionInput(
      defaultArgs.options,
      defaultArgs.value,
      defaultArgs.onChange
    ));

    // Mock the input ref
    Object.defineProperty(result.current.inputRef, 'current', {
      value: {
        getBoundingClientRect: mockGetBoundingClientRect,
      },
      writable: true,
    });

    const mockEvent = {
      target: { value: 'hello @john', selectionStart: 11 },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleInputChange(mockEvent);
    });

    expect(result.current.input).toBe('hello @john');
    expect(result.current.showMenu).toBe(true);
    expect(result.current.mentionQuery).toBe('john');
  });

  it('handles option selection', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useMentionInput(
      defaultArgs.options,
      defaultArgs.value,
      onChange
    ));

    const mockFocus = jest.fn();
    Object.defineProperty(result.current.inputRef, 'current', {
      value: { focus: mockFocus },
      writable: true,
    });

    act(() => {
      result.current.handleSelect(mockOptions[0]);
    });

    expect(onChange).toHaveBeenCalledWith(['1']);
    expect(result.current.input).toBe('');
    expect(result.current.showMenu).toBe(false);
    expect(result.current.mentionQuery).toBe('');
    expect(result.current.activeIndex).toBe(0);
    expect(mockFocus).toHaveBeenCalled();
  });

  it('handles option removal', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useMentionInput(
      defaultArgs.options,
      ['1', '2'],
      onChange
    ));

    act(() => {
      result.current.handleRemove('1');
    });

    expect(onChange).toHaveBeenCalledWith(['2']);
  });

  it('handles search change', () => {
    const { result } = renderHook(() => useMentionInput(
      defaultArgs.options,
      defaultArgs.value,
      defaultArgs.onChange
    ));

    const mockEvent = {
      target: { value: 'jane' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleSearchChange(mockEvent);
    });

    expect(result.current.mentionQuery).toBe('jane');
    expect(result.current.activeIndex).toBe(0);
  });

  it('handles keyboard navigation - arrow down', () => {
    const { result } = renderHook(() => useMentionInput(
      defaultArgs.options,
      defaultArgs.value,
      defaultArgs.onChange
    ));

    // Set up state for menu to be shown with filtered options
    act(() => {
      result.current.handleInputChange({
        target: { value: '@', selectionStart: 1 },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    const mockEvent = {
      key: 'ArrowDown',
      preventDefault: jest.fn(),
    } as any;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(result.current.activeIndex).toBe(1);
  });

  it('handles keyboard navigation - arrow up', () => {
    const { result } = renderHook(() => useMentionInput(
      defaultArgs.options,
      defaultArgs.value,
      defaultArgs.onChange
    ));

    // Set up state
    act(() => {
      result.current.handleInputChange({
        target: { value: '@', selectionStart: 1 },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Set active index to 1 first
    act(() => {
      result.current.setActiveIndex(1);
    });

    const mockEvent = {
      key: 'ArrowUp',
      preventDefault: jest.fn(),
    } as any;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(result.current.activeIndex).toBe(0);
  });

  it('handles enter key to select option', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useMentionInput(
      defaultArgs.options,
      defaultArgs.value,
      onChange
    ));

    const mockFocus = jest.fn();
    Object.defineProperty(result.current.inputRef, 'current', {
      value: { focus: mockFocus },
      writable: true,
    });

    // Set up state
    act(() => {
      result.current.handleInputChange({
        target: { value: '@', selectionStart: 1 },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    const mockEvent = {
      key: 'Enter',
      preventDefault: jest.fn(),
    } as any;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(['1']); // First option should be selected
  });

  it('handles backspace to remove last selected item', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useMentionInput(
      defaultArgs.options,
      ['1', '2'],
      onChange
    ));

    const mockEvent = {
      key: 'Backspace',
      preventDefault: jest.fn(),
    } as any;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(['1']);
  });
});