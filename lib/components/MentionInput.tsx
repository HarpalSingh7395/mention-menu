import React from 'react';
import type { MentionInputProps } from '../types/MentionInput.types';
import { useMentionInput } from '../hooks/useMentionInput';
import { DefaultBadge, DefaultSuggestion, DefaultDropdownItem } from './DefaultComponents';
import { classNames } from '../utils/MentionInput.utils';
import '../styles/MentionInput.css';

export const MentionInput: React.FC<MentionInputProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Type @ to mention...',
  showSuggestions = true,
  suggestionLimit = 5,
  classNames: customClassNames = {},
  customBadge: CustomBadge,
  customSuggestion: CustomSuggestion,
  customDropdownItem: CustomDropdownItem,
}) => {
  const {
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
  } = useMentionInput(options, value, onChange);

  const limitedSuggestions = unselectedOptions.slice(0, suggestionLimit);

  const BadgeComponent = CustomBadge || DefaultBadge;
  const SuggestionComponent = CustomSuggestion || DefaultSuggestion;
  const DropdownItemComponent = CustomDropdownItem || DefaultDropdownItem;

  return (
    <div className={classNames('mention-input-container', customClassNames.container)}>
      {/* Selected Values and Input */}
      <div className={classNames('mention-input-selected-container', customClassNames.selectedContainer)}>
        {/* Selected Badges */}
        {value.map((val) => {
          const option = options.find((o) => o.value === val);
          if (!option) return null;
          
          return (
            <BadgeComponent
              key={option.value}
              option={option}
              onRemove={() => handleRemove(option.value)}
              className={customClassNames.selectedBadge}
            />
          );
        })}

        {/* Inline Suggestions */}
        {showSuggestions && limitedSuggestions.length > 0 && (
          <>
            {limitedSuggestions.map((option) => (
              <SuggestionComponent
                key={option.value}
                option={option}
                onSelect={() => handleSelect(option)}
                className={customClassNames.suggestion}
              />
            ))}
          </>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          className={classNames('mention-input-input', customClassNames.input)}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          type="text"
        />
      </div>

      {/* Floating Dropdown */}
      {showMenu && (
        <div
          ref={dropdownRef}
          className={classNames('mention-input-dropdown', customClassNames.dropdown)}
          style={{
            position: 'fixed',
            left: `${dropdownPosition.x}px`,
            top: `${dropdownPosition.y}px`,
          }}
        >
          {/* Search Input */}
          <input
            className={classNames('mention-input-dropdown-search', customClassNames.dropdownSearch)}
            placeholder="Search..."
            value={mentionQuery}
            onChange={handleSearchChange}
            type="text"
          />

          {/* Options List */}
          <div className={classNames('mention-input-dropdown-list', customClassNames.dropdownList)}>
            {filteredOptions.length === 0 ? (
              <div className={classNames('mention-input-dropdown-empty', customClassNames.dropdownEmpty)}>
                No results found.
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <DropdownItemComponent
                  key={option.value}
                  option={option}
                  isActive={index === activeIndex}
                  onSelect={() => handleSelect(option)}
                  className={classNames(
                    customClassNames.dropdownItem,
                    index === activeIndex && customClassNames.dropdownItemActive
                  )}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentionInput;