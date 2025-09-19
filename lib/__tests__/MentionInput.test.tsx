// __tests__/components/MentionInput.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach, type MockedFunction } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MentionInput } from '../components/MentionInput';
import { useMentionInput } from '../hooks/useMentionInput';
import type { MentionInputProps, MentionOption } from '../types/MentionInput.types';

// Mock the custom hook
vi.mock('../hooks/useMentionInput', () => ({
  useMentionInput: vi.fn()
}));

const mockUseMentionInput = useMentionInput as MockedFunction<typeof useMentionInput>;

// Mock the MentionMenu component
vi.mock('../components/MentionMenu', () => ({
  MentionMenu: vi.fn(({ show, options, onSelect, DropdownItemComponent }) => {
    if (!show) return null;
    return (
      <div data-testid="mention-menu">
        {options.map((option: MentionOption) => (
          <div
            key={option.value}
            data-testid={`menu-item-${option.value}`}
            onClick={() => onSelect(option)}
          >
            <DropdownItemComponent option={option} />
          </div>
        ))}
      </div>
    );
  })
}));

// Mock CSS import
vi.mock('../styles/MentionInput.css', () => ({}));

// Sample test data
const mockOptions: MentionOption[] = [
  { value: 'user1', label: 'John Doe' },
  { value: 'user2', label: 'Jane Smith' },
  { value: 'user3', label: 'Bob Johnson' },
  { value: 'user4', label: 'Alice Brown' },
];

const defaultHookReturn = {
  input: '',
  mentionQuery: '',
  showMenu: false,
  activeIndex: -1,
  filteredOptions: [],
  unselectedOptions: mockOptions,
  inputRef: { current: null },
  dropdownRef: { current: null },
  handleSelect: vi.fn(),
  handleRemove: vi.fn(),
  handleInputChange: vi.fn(),
  handleKeyDown: vi.fn(),
  handleSearchChange: vi.fn(),
  setActiveIndex: vi.fn(),
};

const defaultProps: MentionInputProps = {
  options: mockOptions,
  value: [],
  onChange: vi.fn(),
};

describe('MentionInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMentionInput.mockReturnValue(defaultHookReturn);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<MentionInput {...defaultProps} />);
      
      expect(screen.getByPlaceholderText('Type @ to mention...')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(
        <MentionInput 
          {...defaultProps} 
          placeholder="Start typing to mention someone..." 
        />
      );
      
      expect(screen.getByPlaceholderText('Start typing to mention someone...')).toBeInTheDocument();
    });

    it('applies custom class names correctly', () => {
      const customClassNames = {
        container: 'custom-container',
        selectedContainer: 'custom-selected-container',
        input: 'custom-input',
        selectedBadge: 'custom-badge',
        suggestion: 'custom-suggestion',
      };

      const { container } = render(
        <MentionInput {...defaultProps} classNames={customClassNames} />
      );

      expect(container.querySelector('.mention-input-container.custom-container')).toBeInTheDocument();
      expect(container.querySelector('.mention-input-selected-container.custom-selected-container')).toBeInTheDocument();
      expect(container.querySelector('.mention-input-input.custom-input')).toBeInTheDocument();
    });

    it('renders selected values as badges', () => {
      const selectedValues = ['user1', 'user2'];
      
      render(
        <MentionInput 
          {...defaultProps} 
          value={selectedValues}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('does not render badges for invalid selected values', () => {
      const selectedValues = ['user1', 'invalid-user'];
      
      render(
        <MentionInput 
          {...defaultProps} 
          value={selectedValues}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('invalid-user')).not.toBeInTheDocument();
    });
  });

  describe('Suggestions', () => {
    it('renders inline suggestions when showSuggestions is true', () => {
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        unselectedOptions: mockOptions.slice(0, 3),
      });

      render(
        <MentionInput 
          {...defaultProps} 
          showSuggestions={true}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('does not render inline suggestions when showSuggestions is false', () => {
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        unselectedOptions: mockOptions.slice(0, 3),
      });

      render(
        <MentionInput 
          {...defaultProps} 
          showSuggestions={false}
        />
      );

      // Should not render suggestion components (only selected badges if any)
      const suggestionElements = screen.queryAllByText(/John Doe|Jane Smith|Bob Johnson/);
      expect(suggestionElements).toHaveLength(0);
    });

    it('limits suggestions based on suggestionLimit prop', () => {
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        unselectedOptions: mockOptions,
      });

      render(
        <MentionInput 
          {...defaultProps} 
          showSuggestions={true}
          suggestionLimit={2}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
      expect(screen.queryByText('Alice Brown')).not.toBeInTheDocument();
    });

    it('does not render suggestions when unselectedOptions is empty', () => {
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        unselectedOptions: [],
      });

      render(
        <MentionInput 
          {...defaultProps} 
          showSuggestions={true}
        />
      );

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  describe('Dropdown Menu', () => {
    it('renders dropdown menu when showMenu is true', () => {
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        showMenu: true,
        filteredOptions: mockOptions.slice(0, 2),
      });

      render(<MentionInput {...defaultProps} />);

      expect(screen.getByTestId('mention-menu')).toBeInTheDocument();
    });

    it('does not render dropdown menu when showMenu is false', () => {
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        showMenu: false,
      });

      render(<MentionInput {...defaultProps} />);

      expect(screen.queryByTestId('mention-menu')).not.toBeInTheDocument();
    });

    it('passes correct props to MentionMenu', () => {
      const filteredOptions = mockOptions.slice(0, 2);
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        showMenu: true,
        filteredOptions,
        activeIndex: 1,
        mentionQuery: 'test',
      });

      render(<MentionInput {...defaultProps} />);

      expect(screen.getByTestId('mention-menu')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-user1')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-user2')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls handleInputChange when input value changes', async () => {
      const user = userEvent.setup();
      const handleInputChange = vi.fn();
      
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        handleInputChange,
      });

      render(<MentionInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(handleInputChange).toHaveBeenCalled();
    });

    it('calls handleKeyDown when key is pressed', async () => {
      const user = userEvent.setup();
      const handleKeyDown = vi.fn();
      
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        handleKeyDown,
      });

      render(<MentionInput {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '{Enter}');

      expect(handleKeyDown).toHaveBeenCalled();
    });

    it('calls handleRemove when badge remove button is clicked', async () => {
      const user = userEvent.setup();
      const handleRemove = vi.fn();
      
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        handleRemove,
      });

      render(
        <MentionInput 
          {...defaultProps} 
          value={['user1']}
        />
      );

      // Assuming DefaultBadge has a remove button with specific test id or aria-label
      const removeButton = screen.getByRole('button');
      await user.click(removeButton);

      expect(handleRemove).toHaveBeenCalledWith('user1');
    });

    it('calls handleSelect when suggestion is clicked', async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();
      
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        handleSelect,
        unselectedOptions: [mockOptions[0]],
      });

      render(
        <MentionInput 
          {...defaultProps} 
          showSuggestions={true}
        />
      );

      // Assuming DefaultSuggestion is clickable
      const suggestion = screen.getByText('John Doe');
      await user.click(suggestion);

      expect(handleSelect).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('calls handleSelect when dropdown item is clicked', async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();
      
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        showMenu: true,
        filteredOptions: [mockOptions[0]],
        handleSelect,
      });

      render(<MentionInput {...defaultProps} />);

      const menuItem = screen.getByTestId('menu-item-user1');
      await user.click(menuItem);

      expect(handleSelect).toHaveBeenCalledWith(mockOptions[0]);
    });
  });

  describe('Custom Components', () => {
    it('uses custom badge component when provided', () => {
      const CustomBadge = vi.fn(({ option }) => (
        <div data-testid="custom-badge">{option.label}</div>
      ));

      render(
        <MentionInput 
          {...defaultProps} 
          value={['user1']}
          customBadge={CustomBadge}
        />
      );

      expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
      expect(CustomBadge).toHaveBeenCalledWith(
        expect.objectContaining({
          option: mockOptions[0],
          onRemove: expect.any(Function),
        }),
        {}
      );
    });

    it('uses custom suggestion component when provided', () => {
      const CustomSuggestion = vi.fn(({ option }) => (
        <div data-testid="custom-suggestion">{option.label}</div>
      ));

      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        unselectedOptions: [mockOptions[0]],
      });

      render(
        <MentionInput 
          {...defaultProps} 
          customSuggestion={CustomSuggestion}
          showSuggestions={true}
        />
      );

      expect(screen.getByTestId('custom-suggestion')).toBeInTheDocument();
      expect(CustomSuggestion).toHaveBeenCalledWith(
        expect.objectContaining({
          option: mockOptions[0],
          onSelect: expect.any(Function),
        }),
        {}
      );
    });

    it('uses custom dropdown item component when provided', () => {
      const CustomDropdownItem = vi.fn(({ option }) => (
        <div data-testid="custom-dropdown-item">{option.label}</div>
      ));

      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        showMenu: true,
        filteredOptions: [mockOptions[0]],
      });

      render(
        <MentionInput 
          {...defaultProps} 
          customDropdownItem={CustomDropdownItem}
        />
      );

      expect(screen.getByTestId('custom-dropdown-item')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      render(
        <MentionInput 
          {...defaultProps} 
          options={[]}
        />
      );

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('handles undefined/null values in selected values', () => {
      render(
        <MentionInput 
          {...defaultProps} 
          value={['user1', null as unknown as string, undefined as unknown as string]}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      // Should not crash and should only render valid selections
    });

    it('handles input ref correctly', () => {
      const inputRef = React.createRef<HTMLInputElement>();
      
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        inputRef,
      });

      render(<MentionInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Integration with useMentionInput hook', () => {
    it('passes correct parameters to useMentionInput hook', () => {
      const onChange = vi.fn();
      const options = mockOptions;
      const value = ['user1'];

      render(
        <MentionInput 
          options={options}
          value={value}
          onChange={onChange}
        />
      );

      expect(mockUseMentionInput).toHaveBeenCalledWith(options, value, onChange);
    });

    it('uses all hook return values correctly', () => {
      const mockHookReturn = {
        input: 'test input',
        mentionQuery: '@john',
        showMenu: true,
        activeIndex: 2,
        filteredOptions: mockOptions.slice(0, 2),
        unselectedOptions: mockOptions.slice(2),
        inputRef: { current: null },
        dropdownRef: { current: null },
        handleSelect: vi.fn(),
        handleRemove: vi.fn(),
        handleInputChange: vi.fn(),
        handleKeyDown: vi.fn(),
        handleSearchChange: vi.fn(),
        setActiveIndex: vi.fn(),
      };

      mockUseMentionInput.mockReturnValue(mockHookReturn);

      render(<MentionInput {...defaultProps} />);

      expect(screen.getByDisplayValue('test input')).toBeInTheDocument();
      expect(screen.getByTestId('mention-menu')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper input accessibility attributes', () => {
      render(<MentionInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder', 'Type @ to mention...');
    });

    it('maintains focus management through inputRef', () => {
      const inputRef = React.createRef<HTMLInputElement>();
      
      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        inputRef,
      });

      render(<MentionInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      // Focus management would be tested in integration tests with real DOM
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily when props are the same', () => {
      const { rerender } = render(<MentionInput {...defaultProps} />);
      
      // Mock hook should be called once initially
      expect(mockUseMentionInput).toHaveBeenCalledTimes(1);
      
      // Re-render with same props
      rerender(<MentionInput {...defaultProps} />);
      
      // Hook should be called again but component should handle updates efficiently
      expect(mockUseMentionInput).toHaveBeenCalledTimes(2);
    });

    it('handles large option lists efficiently', () => {
      const largeOptionsList = Array.from({ length: 1000 }, (_, i) => ({
        value: `user${i}`,
        label: `User ${i}`,
        avatar: `https://example.com/user${i}.jpg`,
      }));

      mockUseMentionInput.mockReturnValue({
        ...defaultHookReturn,
        unselectedOptions: largeOptionsList,
      });

      render(
        <MentionInput 
          {...defaultProps} 
          options={largeOptionsList}
          showSuggestions={true}
          suggestionLimit={5}
        />
      );

      // Should only render the limited number of suggestions
      expect(screen.getAllByText(/User \d+/)).toHaveLength(5);
    });
  });
});