import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DefaultBadge, DefaultSuggestion, DefaultDropdownItem } from '../components/DefaultComponents';
import { type MentionOption } from '../types/MentionInput.types';

// Mock the classNames utility
vi.mock('../utils/MentionInput.utils', () => ({
  classNames: vi.fn((...classes) => classes.filter(Boolean).join(' '))
}));

// Sample test data
const mockOption: MentionOption = {
  id: 'test-1',
  label: 'Test Option',
  value: 'test-option'
};

const mockOptionWithIcon: MentionOption = {
  id: 'test-2',
  label: 'Option with Icon',
  value: 'option-with-icon',
  icon: '🔥'
};

describe('DefaultBadge', () => {
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render badge with option label', () => {
    render(<DefaultBadge option={mockOption} onRemove={mockOnRemove} />);
    
    expect(screen.getByText('Test Option')).toBeInTheDocument();
  });

  it('should render badge with icon when option has icon', () => {
    render(<DefaultBadge option={mockOptionWithIcon} onRemove={mockOnRemove} />);
    
    expect(screen.getByText('🔥')).toBeInTheDocument();
    expect(screen.getByText('Option with Icon')).toBeInTheDocument();
  });

  it('should not render icon when option has no icon', () => {
    render(<DefaultBadge option={mockOption} onRemove={mockOnRemove} />);
    
    const iconElement = screen.queryByText('🔥');
    expect(iconElement).not.toBeInTheDocument();
  });

  it('should render remove button with correct aria-label', () => {
    render(<DefaultBadge option={mockOption} onRemove={mockOnRemove} />);
    
    const removeButton = screen.getByRole('button', { name: 'Remove Test Option' });
    expect(removeButton).toBeInTheDocument();
    expect(removeButton).toHaveTextContent('✕');
  });

  it('should call onRemove when remove button is clicked', () => {
    render(<DefaultBadge option={mockOption} onRemove={mockOnRemove} />);
    
    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);
    
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it('should apply default CSS classes', () => {
    render(<DefaultBadge option={mockOption} onRemove={mockOnRemove} />);
    
    const badgeElement = screen.getByText('Test Option').closest('div');
    expect(badgeElement).toHaveClass('mention-input-selected-badge');
  });

  it('should apply additional className when provided', () => {
    render(
      <DefaultBadge 
        option={mockOption} 
        onRemove={mockOnRemove} 
        className="custom-class" 
      />
    );
    
    const badgeElement = screen.getByText('Test Option').closest('div');
    expect(badgeElement).toHaveClass('mention-input-selected-badge', 'custom-class');
  });

  it('should have correct CSS classes for child elements', () => {
    render(<DefaultBadge option={mockOptionWithIcon} onRemove={mockOnRemove} />);
    
    const iconElement = screen.getByText('🔥');
    const labelElement = screen.getByText('Option with Icon');
    const removeButton = screen.getByRole('button');
    
    expect(iconElement).toHaveClass('mention-input-selected-badge-icon');
    expect(labelElement).toHaveClass('mention-input-selected-badge-label');
    expect(removeButton).toHaveClass('mention-input-selected-badge-remove');
  });
});

describe('DefaultSuggestion', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render suggestion with option label', () => {
    render(<DefaultSuggestion option={mockOption} onSelect={mockOnSelect} />);
    
    expect(screen.getByText('Test Option')).toBeInTheDocument();
  });

  it('should render with default plus icon', () => {
    render(<DefaultSuggestion option={mockOption} onSelect={mockOnSelect} />);
    
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('should call onSelect when clicked', () => {
    render(<DefaultSuggestion option={mockOption} onSelect={mockOnSelect} />);
    
    const suggestionButton = screen.getByRole('button');
    fireEvent.click(suggestionButton);
    
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('should apply default CSS classes', () => {
    render(<DefaultSuggestion option={mockOption} onSelect={mockOnSelect} />);
    
    const suggestionButton = screen.getByRole('button');
    expect(suggestionButton).toHaveClass('mention-input-suggestion');
  });

  it('should apply additional className when provided', () => {
    render(
      <DefaultSuggestion 
        option={mockOption} 
        onSelect={mockOnSelect} 
        className="custom-suggestion-class" 
      />
    );
    
    const suggestionButton = screen.getByRole('button');
    expect(suggestionButton).toHaveClass('mention-input-suggestion', 'custom-suggestion-class');
  });

  it('should have correct CSS classes for child elements', () => {
    render(<DefaultSuggestion option={mockOption} onSelect={mockOnSelect} />);
    
    const iconElement = screen.getByText('+');
    const labelElement = screen.getByText('Test Option');
    
    expect(iconElement).toHaveClass('mention-input-suggestion-icon');
    expect(labelElement).toHaveClass('mention-input-suggestion-label');
  });

  it('should be accessible as a button', () => {
    render(<DefaultSuggestion option={mockOption} onSelect={mockOnSelect} />);
    
    const suggestionButton = screen.getByRole('button');
    expect(suggestionButton).toHaveAttribute('type', 'button');
  });
});

describe('DefaultDropdownItem', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dropdown item with option label', () => {
    render(
      <DefaultDropdownItem 
        option={mockOption} 
        isActive={false} 
        onSelect={mockOnSelect} 
      />
    );
    
    expect(screen.getByText('Test Option')).toBeInTheDocument();
  });

  it('should render with icon when option has icon', () => {
    render(
      <DefaultDropdownItem 
        option={mockOptionWithIcon} 
        isActive={false} 
        onSelect={mockOnSelect} 
      />
    );
    
    expect(screen.getByText('🔥')).toBeInTheDocument();
    expect(screen.getByText('Option with Icon')).toBeInTheDocument();
  });

  it('should not render icon when option has no icon', () => {
    render(
      <DefaultDropdownItem 
        option={mockOption} 
        isActive={false} 
        onSelect={mockOnSelect} 
      />
    );
    
    const iconElement = screen.queryByText('🔥');
    expect(iconElement).not.toBeInTheDocument();
  });

  it('should call onSelect when clicked', () => {
    render(
      <DefaultDropdownItem 
        option={mockOption} 
        isActive={false} 
        onSelect={mockOnSelect} 
      />
    );
    
    const dropdownItem = screen.getByText('Test Option').closest('div');
    fireEvent.click(dropdownItem!);
    
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('should apply active class when isActive is true', () => {
    render(
      <DefaultDropdownItem 
        option={mockOption} 
        isActive={true} 
        onSelect={mockOnSelect} 
      />
    );
    
    const dropdownItem = screen.getByText('Test Option').closest('div');
    expect(dropdownItem).toHaveClass('mention-input-dropdown-item', 'mention-input-dropdown-item-active');
  });

  it('should not apply active class when isActive is false', () => {
    render(
      <DefaultDropdownItem 
        option={mockOption} 
        isActive={false} 
        onSelect={mockOnSelect} 
      />
    );
    
    const dropdownItem = screen.getByText('Test Option').closest('div');
    expect(dropdownItem).toHaveClass('mention-input-dropdown-item');
    expect(dropdownItem).not.toHaveClass('mention-input-dropdown-item-active');
  });

  it('should apply additional className when provided', () => {
    render(
      <DefaultDropdownItem 
        option={mockOption} 
        isActive={false} 
        onSelect={mockOnSelect} 
        className="custom-dropdown-class" 
      />
    );
    
    const dropdownItem = screen.getByText('Test Option').closest('div');
    expect(dropdownItem).toHaveClass('mention-input-dropdown-item', 'custom-dropdown-class');
  });

  it('should handle mouse enter event', () => {
    render(
      <DefaultDropdownItem 
        option={mockOption} 
        isActive={false} 
        onSelect={mockOnSelect} 
      />
    );
    
    const dropdownItem = screen.getByText('Test Option').closest('div');
    
    // Should not throw error when mouse enter is triggered
    expect(() => {
      fireEvent.mouseEnter(dropdownItem!);
    }).not.toThrow();
  });

  it('should have correct CSS classes for child elements', () => {
    render(
      <DefaultDropdownItem 
        option={mockOptionWithIcon} 
        isActive={false} 
        onSelect={mockOnSelect} 
      />
    );
    
    const iconElement = screen.getByText('🔥');
    const labelElement = screen.getByText('Option with Icon');
    
    expect(iconElement).toHaveClass('mention-input-dropdown-item-icon');
    expect(labelElement).toHaveClass('mention-input-dropdown-item-label');
  });

  it('should render correctly with all props combined', () => {
    render(
      <DefaultDropdownItem 
        option={mockOptionWithIcon} 
        isActive={true} 
        onSelect={mockOnSelect} 
        className="combined-test-class"
      />
    );
    
    const dropdownItem = screen.getByText('Option with Icon').closest('div');
    const iconElement = screen.getByText('🔥');
    const labelElement = screen.getByText('Option with Icon');
    
    expect(dropdownItem).toHaveClass(
      'mention-input-dropdown-item', 
      'mention-input-dropdown-item-active', 
      'combined-test-class'
    );
    expect(iconElement).toHaveClass('mention-input-dropdown-item-icon');
    expect(labelElement).toHaveClass('mention-input-dropdown-item-label');
  });
});

// Integration tests
describe('Component Integration', () => {
  it('should handle complex option objects consistently across all components', () => {
    const complexOption: MentionOption = {
      id: 'complex-1',
      label: 'Complex Option with Special Characters & Symbols',
      value: 'complex-option',
      icon: '⚡'
    };

    const mockOnRemove = vi.fn();
    const mockOnSelect = vi.fn();

    const { rerender } = render(
      <DefaultBadge option={complexOption} onRemove={mockOnRemove} />
    );

    expect(screen.getByText('Complex Option with Special Characters & Symbols')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();

    rerender(
      <DefaultSuggestion option={complexOption} onSelect={mockOnSelect} />
    );

    expect(screen.getByText('Complex Option with Special Characters & Symbols')).toBeInTheDocument();

    rerender(
      <DefaultDropdownItem 
        option={complexOption} 
        isActive={true} 
        onSelect={mockOnSelect} 
      />
    );

    expect(screen.getByText('Complex Option with Special Characters & Symbols')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('should handle empty or minimal option objects', () => {
    const minimalOption: MentionOption = {
      id: '',
      label: '',
      value: ''
    };

    const mockOnRemove = vi.fn();
    const mockOnSelect = vi.fn();

    render(<DefaultBadge option={minimalOption} onRemove={mockOnRemove} />);
    expect(screen.getByRole('button', { name: 'Remove ' })).toBeInTheDocument();

    render(<DefaultSuggestion option={minimalOption} onSelect={mockOnSelect} />);
    expect(screen.getByRole('button')).toBeInTheDocument();

    render(
      <DefaultDropdownItem 
        option={minimalOption} 
        isActive={false} 
        onSelect={mockOnSelect} 
      />
    );
    expect(screen.getByText('')).toBeInTheDocument();
  });
});