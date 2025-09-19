// components/__tests__/MentionMenu.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MentionMenu } from '../components/MentionMenu';
import type { MentionOption } from '../types/MentionInput.types';

// Mock the utility functions
vi.mock('../utils/MentionInput.utils', () => ({
  classNames: vi.fn((...args) => args.filter(Boolean).join(' ')),
  getCaretCoordinates: vi.fn(() => ({ x: 100, y: 50 })),
  calculateDropdownPosition: vi.fn(() => ({ x: 100, y: 80 }))
}));

// Mock component for dropdown items
const MockDropdownItemComponent: React.FC<any> = ({ 
  option, 
  isActive, 
  onSelect, 
  className 
}) => (
  <div 
    className={className}
    data-testid={`dropdown-item-${option.value}`}
    data-active={isActive}
    onClick={onSelect}
  >
    {option.label}
  </div>
);

describe('MentionMenu', () => {
  const mockOptions: MentionOption[] = [
    { value: 'user1', label: 'John Doe' },
    { value: 'user2', label: 'Jane Smith' },
    { value: 'user3', label: 'Bob Johnson' }
  ];

  const defaultProps = {
    inputRef: { current: document.createElement('input') } as React.RefObject<HTMLInputElement>,
    options: mockOptions,
    activeIndex: 0,
    mentionQuery: '',
    show: true,
    onSelect: vi.fn(),
    onSearchChange: vi.fn(),
    setActiveIndex: vi.fn(),
    customClassNames: {
      dropdown: 'custom-dropdown',
      dropdownSearch: 'custom-search',
      dropdownList: 'custom-list',
      dropdownEmpty: 'custom-empty',
      dropdownItem: 'custom-item',
      dropdownItemActive: 'custom-item-active'
    },
    DropdownItemComponent: MockDropdownItemComponent,
    dropdownWidth: 280,
    dropdownHeight: 300
  };

  let mockInputElement: HTMLInputElement;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create a proper mock input element
    mockInputElement = document.createElement('input');
    mockInputElement.selectionStart = 5;
    mockInputElement.value = 'Hello';
    
    // Mock getBoundingClientRect
    mockInputElement.getBoundingClientRect = vi.fn(() => ({
      left: 10,
      top: 20,
      width: 200,
      height: 30,
      right: 210,
      bottom: 50,
      x: 10,
      y: 20,
      toJSON: () => {}
    }));

    // Update the inputRef to use our mock element
    defaultProps.inputRef.current = mockInputElement;

    // Mock RAF for consistent testing
    global.requestAnimationFrame = vi.fn((cb) => {
      setTimeout(cb, 0);
      return 1;
    });
    global.cancelAnimationFrame = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render nothing when show is false', () => {
      const { container } = render(
        <MentionMenu {...defaultProps} show={false} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should render the dropdown when show is true', () => {
      render(<MentionMenu {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('should render all options', () => {
      render(<MentionMenu {...defaultProps} />);
      
      mockOptions.forEach(option => {
        expect(screen.getByTestId(`dropdown-item-${option.value}`)).toBeInTheDocument();
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('should render empty state when no options', () => {
      render(<MentionMenu {...defaultProps} options={[]} />);
      
      expect(screen.getByText('No results found.')).toBeInTheDocument();
    });

    it('should apply custom class names', () => {
      render(<MentionMenu {...defaultProps} />);
      
      const dropdown = screen.getByRole('dialog');
      expect(dropdown).toHaveClass('mention-input-dropdown', 'custom-dropdown');
      
      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput).toHaveClass('mention-input-dropdown-search', 'custom-search');
    });
  });

  describe('Positioning', () => {
    it('should start with offscreen coordinates', () => {
      render(<MentionMenu {...defaultProps} />);
      
      const dropdown = screen.getByRole('dialog');
      expect(dropdown).toHaveStyle({
        left: '-9999px',
        top: '-9999px',
        visibility: 'hidden',
        opacity: '0'
      });
    });

    it('should update position after RAF', async () => {
      render(<MentionMenu {...defaultProps} />);
      
      // Wait for RAF to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      const dropdown = screen.getByRole('dialog');
      expect(dropdown).toHaveStyle({
        left: '100px',
        top: '80px',
        visibility: 'visible',
        opacity: '1'
      });
    });

    it('should set dropdown dimensions correctly', () => {
      render(<MentionMenu {...defaultProps} dropdownWidth={350} dropdownHeight={400} />);
      
      const dropdown = screen.getByRole('dialog');
      expect(dropdown).toHaveStyle({
        width: '350px',
        maxHeight: '400px'
      });
    });
  });

  describe('Search Functionality', () => {
    it('should display current mentionQuery in search input', () => {
      render(<MentionMenu {...defaultProps} mentionQuery="john" />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput).toHaveValue('john');
    });

    it('should call onSearchChange when typing in search', async () => {
      const user = userEvent.setup();
      render(<MentionMenu {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'test');
      
      expect(defaultProps.onSearchChange).toHaveBeenCalled();
    });

    it('should auto-focus search input', () => {
      render(<MentionMenu {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput).toHaveFocus();
    });
  });

  describe('Option Selection', () => {
    it('should highlight active option', async () => {
      render(<MentionMenu {...defaultProps} activeIndex={1} />);
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      const activeItem = screen.getByTestId('dropdown-item-user2');
      expect(activeItem).toHaveAttribute('data-active', 'true');
      expect(activeItem).toHaveClass('custom-item-active');
    });

    it('should call onSelect when option is clicked', async () => {
      const user = userEvent.setup();
      render(<MentionMenu {...defaultProps} />);
      
      const firstOption = screen.getByTestId('dropdown-item-user1');
      await user.click(firstOption);
      
      expect(defaultProps.onSelect).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('should update active index on mouse enter', async () => {
      const user = userEvent.setup();
      render(<MentionMenu {...defaultProps} />);
      
      const secondOption = screen.getByTestId('dropdown-item-user2');
      await user.hover(secondOption);
      
      expect(defaultProps.setActiveIndex).toHaveBeenCalledWith(1);
    });

    it('should prevent default on mouse down to prevent blur', () => {
      render(<MentionMenu {...defaultProps} />);
      
      const firstOption = screen.getByTestId('dropdown-item-user1');
      const parentDiv = firstOption.parentElement!;
      
      const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
      const preventDefaultSpy = vi.spyOn(mouseDownEvent, 'preventDefault');
      
      fireEvent(parentDiv, mouseDownEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Event Listeners', () => {
    it('should add event listeners when shown', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const docAddEventListenerSpy = vi.spyOn(document, 'addEventListener');
      
      render(<MentionMenu {...defaultProps} />);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(docAddEventListenerSpy).toHaveBeenCalledWith('selectionchange', expect.any(Function));
    });

    it('should remove event listeners when unmounted', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const docRemoveEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<MentionMenu {...defaultProps} />);
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(docRemoveEventListenerSpy).toHaveBeenCalledWith('selectionchange', expect.any(Function));
    });

    it('should remove event listeners when show becomes false', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const { rerender } = render(<MentionMenu {...defaultProps} />);
      rerender(<MentionMenu {...defaultProps} show={false} />);
      
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<MentionMenu {...defaultProps} />);
      
      const dropdown = screen.getByRole('dialog');
      expect(dropdown).toHaveAttribute('aria-hidden', 'true'); // Initially hidden due to positioning
    });

    it('should update aria-hidden when positioned', async () => {
      render(<MentionMenu {...defaultProps} />);
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      const dropdown = screen.getByRole('dialog');
      expect(dropdown).toHaveAttribute('aria-hidden', 'false');
    });

    it('should have proper pointer events when positioned', async () => {
      render(<MentionMenu {...defaultProps} />);
      
      const dropdown = screen.getByRole('dialog');
      expect(dropdown).toHaveStyle('pointer-events: none');

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      expect(dropdown).toHaveStyle('pointer-events: auto');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing inputRef gracefully', () => {
      const propsWithoutInput = {
        ...defaultProps,
        inputRef: { current: null }
      };
      
      expect(() => render(<MentionMenu {...propsWithoutInput} />)).not.toThrow();
    });

    it('should handle options prop changes', () => {
      const { rerender } = render(<MentionMenu {...defaultProps} />);
      
      const newOptions = [{ value: 'new', label: 'New User' }];
      rerender(<MentionMenu {...defaultProps} options={newOptions} />);
      
      expect(screen.getByTestId('dropdown-item-new')).toBeInTheDocument();
      expect(screen.queryByTestId('dropdown-item-user1')).not.toBeInTheDocument();
    });

    it('should handle mentionQuery changes', () => {
      const { rerender } = render(<MentionMenu {...defaultProps} mentionQuery="" />);
      
      rerender(<MentionMenu {...defaultProps} mentionQuery="test" />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput).toHaveValue('test');
    });

    it('should use default dimensions when not provided', () => {
      const propsWithoutDimensions = {
        ...defaultProps,
        dropdownWidth: undefined,
        dropdownHeight: undefined
      };
      
      render(<MentionMenu {...propsWithoutDimensions} />);
      
      const dropdown = screen.getByRole('dialog');
      expect(dropdown).toHaveStyle({
        width: '280px',
        maxHeight: '300px'
      });
    });
  });

  describe('Performance', () => {
    it('should cancel animation frames on cleanup', () => {
      const { unmount } = render(<MentionMenu {...defaultProps} />);
      unmount();
      
      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should use measured dimensions when menu element exists', async () => {
      render(<MentionMenu {...defaultProps} />);
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      
      // The calculateDropdownPosition should be called with measured dimensions
      const { calculateDropdownPosition } = await import('../utils/MentionInput.utils');
      expect(calculateDropdownPosition).toHaveBeenCalled();
    });
  });

  describe('Styling and Layout', () => {
    it('should apply transition styles correctly', () => {
      render(<MentionMenu {...defaultProps} />);
      
      const dropdown = screen.getByRole('dialog');
      expect(dropdown).toHaveStyle('transition: opacity 120ms ease');
    });

    it('should set correct overflow styles on list container', () => {
      render(<MentionMenu {...defaultProps} dropdownHeight={300} />);
      
      const listContainer = screen.getByRole('dialog').querySelector('.mention-input-dropdown-list');
      expect(listContainer).toHaveStyle({
        'overflow-y': 'auto',
        'max-height': '252px' // dropdownHeight - 48px for search input
      });
    });

    it('should apply cursor pointer to option containers', () => {
      render(<MentionMenu {...defaultProps} />);
      
      const firstOptionContainer = screen.getByTestId('dropdown-item-user1').parentElement;
      expect(firstOptionContainer).toHaveStyle('cursor: pointer');
    });
  });
});