import React from 'react';
import { type MentionOption } from '../types/MentionInput.types';
import { classNames } from '../utils/MentionInput.utils';

interface DefaultBadgeProps {
  option: MentionOption;
  onRemove: () => void;
  className?: string;
}

export const DefaultBadge: React.FC<DefaultBadgeProps> = ({ option, onRemove, className }) => (
  <div className={classNames('mention-input-selected-badge', className)}>
    {option.icon && (
      <span className="mention-input-selected-badge-icon">{option.icon}</span>
    )}
    <span className="mention-input-selected-badge-label">{option.label}</span>
    <button
      type="button"
      className="mention-input-selected-badge-remove"
      onClick={onRemove}
      aria-label={`Remove ${option.label}`}
    >
      ✕
    </button>
  </div>
);

interface DefaultSuggestionProps {
  option: MentionOption;
  onSelect: () => void;
  className?: string;
}

export const DefaultSuggestion: React.FC<DefaultSuggestionProps> = ({ 
  option, 
  onSelect, 
  className 
}) => (
  <button
    type="button"
    className={classNames('mention-input-suggestion', className)}
    onClick={onSelect}
  >
    <span className="mention-input-suggestion-icon">+</span>
    <span className="mention-input-suggestion-label">{option.label}</span>
  </button>
);

interface DefaultDropdownItemProps {
  option: MentionOption;
  isActive: boolean;
  onSelect: () => void;
  className?: string;
}

export const DefaultDropdownItem: React.FC<DefaultDropdownItemProps> = ({
  option,
  isActive,
  onSelect,
  className,
}) => (
  <div
    className={classNames(
      'mention-input-dropdown-item',
      isActive && 'mention-input-dropdown-item-active',
      className
    )}
    onClick={onSelect}
    onMouseEnter={() => {}} // Handle mouse enter for active state if needed
  >
    {option.icon && (
      <span className="mention-input-dropdown-item-icon">{option.icon}</span>
    )}
    <span className="mention-input-dropdown-item-label">{option.label}</span>
  </div>
);