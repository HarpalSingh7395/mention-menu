import React from 'react';
import type { MentionInputProps, MentionOption } from '../types/MentionInput.types';
import { useMentionInput } from '../hooks/useMentionInput';
import { DefaultBadge, DefaultSuggestion, DefaultDropdownItem } from './DefaultComponents';
import { classNames } from '../utils/MentionInput.utils';
import '../styles/MentionInput.css';
import { MentionMenu } from './MentionMenu';

export const MentionInput: React.FC<MentionInputProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Type @ to mention...',
  trigger = '@', // New trigger prop with default
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
    onClose,
    activeIndex,
    filteredOptions,
    unselectedOptions,
    inputRef,
    handleSelect,
    handleRemove,
    handleInputChange,
    handleKeyDown,
    handleSearchChange,
    setActiveIndex,
  } = useMentionInput(options, value, onChange, trigger); // Pass trigger to hook

  const limitedSuggestions = unselectedOptions.slice(0, suggestionLimit);
  
  const BadgeComponent = CustomBadge || DefaultBadge;
  const SuggestionComponent = CustomSuggestion || DefaultSuggestion;
  const DropdownItemComponent = CustomDropdownItem || DefaultDropdownItem;

  // Update placeholder dynamically based on trigger
  const dynamicPlaceholder = placeholder === 'Type @ to mention...' 
    ? `Type ${trigger} to mention...`
    : placeholder;

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
          placeholder={dynamicPlaceholder}
          type="text"
        />
      </div>

      {/* Floating Dropdown */}
      {showMenu && (
        <MentionMenu
          inputRef={inputRef}
          options={filteredOptions}
          activeIndex={activeIndex}
          mentionQuery={mentionQuery}
          show={showMenu}
          onClose={onClose}
          onSelect={handleSelect}
          onSearchChange={handleSearchChange}
          setActiveIndex={setActiveIndex}
          customClassNames={customClassNames as Record<string, string>}
          DropdownItemComponent={DropdownItemComponent as React.FC<{ 
            option: MentionOption; 
            isActive: boolean; 
            onSelect: () => void; 
            className?: string; 
          }>}
        />
      )}
    </div>
  );
};

export default MentionInput;