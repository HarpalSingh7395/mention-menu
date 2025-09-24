import React, { useState } from 'react';
import { MentionInput } from '../components/MentionInput';
import type { MentionOption, MentionInputClassNames } from '../types/MentionInput.types';

// Sample data for different use cases
const users: MentionOption[] = [
  { value: '1', label: 'John Doe', icon: <span>👤</span> },
  { value: '2', label: 'Jane Smith', icon: <span>👩</span> },
  { value: '3', label: 'Bob Johnson', icon: <span>👨</span> },
  { value: '4', label: 'Alice Brown', icon: <span>👱‍♀️</span> },
  { value: '5', label: 'Charlie Davis', icon: <span>👨‍💼</span> },
];

const teams: MentionOption[] = [
  { value: 'dev', label: 'Development Team', icon: <span>💻</span> },
  { value: 'design', label: 'Design Team', icon: <span>🎨</span> },
  { value: 'marketing', label: 'Marketing Team', icon: <span>📈</span> },
  { value: 'sales', label: 'Sales Team', icon: <span>💼</span> },
];

const hashtags: MentionOption[] = [
  { value: 'react', label: 'React', icon: <span>⚛️</span> },
  { value: 'typescript', label: 'TypeScript', icon: <span>🔷</span> },
  { value: 'javascript', label: 'JavaScript', icon: <span>🟨</span> },
  { value: 'css', label: 'CSS', icon: <span>🎨</span> },
  { value: 'nodejs', label: 'Node.js', icon: <span>🟢</span> },
  { value: 'frontend', label: 'Frontend', icon: <span>🌐</span> },
];

const slashCommands: MentionOption[] = [
  { value: 'help', label: 'Help', icon: <span>❓</span> },
  { value: 'save', label: 'Save Document', icon: <span>💾</span> },
  { value: 'export', label: 'Export as PDF', icon: <span>📄</span> },
  { value: 'settings', label: 'Open Settings', icon: <span>⚙️</span> },
  { value: 'search', label: 'Search Files', icon: <span>🔍</span> },
  { value: 'new', label: 'New Document', icon: <span>📝</span> },
];

const channels: MentionOption[] = [
  { value: 'general', label: 'general', icon: <span>💬</span> },
  { value: 'random', label: 'random', icon: <span>🎲</span> },
  { value: 'dev-team', label: 'dev-team', icon: <span>👩‍💻</span> },
  { value: 'announcements', label: 'announcements', icon: <span>📢</span> },
];

// Custom components
const CustomBadge = ({ option, onRemove, className }: any) => (
  <div className={`custom-badge ${className || ''}`}>
    {option.icon}
    <strong>{option.label}</strong>
    <button onClick={onRemove} className="custom-remove-btn">
      ✕
    </button>
  </div>
);

const HashtagBadge = ({ option, onRemove, className }: any) => (
  <div className={`hashtag-badge ${className || ''}`}>
    <span className="hashtag-symbol">#</span>
    <span>{option.label}</span>
    <button onClick={onRemove} className="hashtag-remove-btn">
      ✕
    </button>
  </div>
);

const CommandBadge = ({ option, onRemove, className }: any) => (
  <div className={`command-badge ${className || ''}`}>
    <span className="command-slash">/</span>
    {option.icon}
    <span>{option.label}</span>
    <button onClick={onRemove} className="command-remove-btn">
      ✕
    </button>
  </div>
);

const ChannelBadge = ({ option, onRemove, className }: any) => (
  <div className={`channel-badge ${className || ''}`}>
    <span className="channel-symbol">#</span>
    <span>{option.label}</span>
    <button onClick={onRemove} className="channel-remove-btn">
      ✕
    </button>
  </div>
);

const CustomSuggestion = ({ option, onSelect, className }: any) => (
  <button 
    className={`custom-suggestion ${className || ''}`}
    onClick={onSelect}
  >
    <span className="suggestion-plus">➕</span>
    {option.icon}
    <span>{option.label}</span>
  </button>
);

const CustomDropdownItem = ({ option, isActive, onSelect, className }: any) => (
  <div 
    className={`custom-dropdown-item ${isActive ? 'active' : ''} ${className || ''}`}
    onClick={onSelect}
  >
    <div className="item-icon">{option.icon}</div>
    <div className="item-content">
      <div className="item-label">{option.label}</div>
      <div className="item-value">@{option.value}</div>
    </div>
  </div>
);

const HashtagDropdownItem = ({ option, isActive, onSelect, className }: any) => (
  <div 
    className={`hashtag-dropdown-item ${isActive ? 'active' : ''} ${className || ''}`}
    onClick={onSelect}
  >
    <div className="item-icon">{option.icon}</div>
    <div className="item-content">
      <div className="item-label">#{option.label}</div>
      <div className="item-value">Tag: {option.value}</div>
    </div>
  </div>
);

export const MentionInputExample: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [selectedCommands, setSelectedCommands] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  // Custom class names
  const customClassNames: MentionInputClassNames = {
    container: 'my-mention-container',
    selectedContainer: 'my-selected-container',
    input: 'my-input',
    dropdown: 'my-dropdown',
  };

  const hashtagClassNames: MentionInputClassNames = {
    container: 'hashtag-container',
    selectedContainer: 'hashtag-selected-container',
    input: 'hashtag-input',
    dropdown: 'hashtag-dropdown',
  };

  const commandClassNames: MentionInputClassNames = {
    container: 'command-container',
    selectedContainer: 'command-selected-container',
    input: 'command-input',
    dropdown: 'command-dropdown',
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px' }}>
      <h1>MentionInput Examples with Custom Triggers</h1>
      
      {/* Basic Example with @ trigger */}
      <section style={{ marginBottom: '40px' }}>
        <h2>1. Basic User Mentions (@ trigger)</h2>
        <p>Default behavior for mentioning users</p>
        <MentionInput
          options={users}
          value={selectedUsers}
          onChange={setSelectedUsers}
          placeholder="Type @ to mention users..."
        />
        <p><strong>Selected users:</strong> {selectedUsers.join(', ')}</p>
      </section>

      {/* Hashtags with # trigger */}
      <section style={{ marginBottom: '40px' }}>
        <h2>2. Hashtags (# trigger)</h2>
        <p>Use # to add topic tags</p>
        <MentionInput
          options={hashtags}
          value={selectedHashtags}
          onChange={setSelectedHashtags}
          trigger="#"
          placeholder="Type # to add hashtags..."
          customBadge={HashtagBadge}
          customDropdownItem={HashtagDropdownItem}
          classNames={hashtagClassNames}
        />
        <p><strong>Selected hashtags:</strong> {selectedHashtags.join(', ')}</p>
      </section>

      {/* Slash Commands */}
      <section style={{ marginBottom: '40px' }}>
        <h2>3. Slash Commands (/ trigger)</h2>
        <p>Use / to execute commands</p>
        <MentionInput
          options={slashCommands}
          value={selectedCommands}
          onChange={setSelectedCommands}
          trigger="/"
          placeholder="Type / for commands..."
          customBadge={CommandBadge}
          showSuggestions={false}
          classNames={commandClassNames}
        />
        <p><strong>Selected commands:</strong> {selectedCommands.join(', ')}</p>
      </section>

      {/* Channel mentions with # */}
      <section style={{ marginBottom: '40px' }}>
        <h2>4. Channel References (# trigger)</h2>
        <p>Reference channels in team communication</p>
        <MentionInput
          options={channels}
          value={selectedChannels}
          onChange={setSelectedChannels}
          trigger="#"
          placeholder="Type # to reference channels..."
          customBadge={ChannelBadge}
          suggestionLimit={2}
        />
        <p><strong>Selected channels:</strong> {selectedChannels.join(', ')}</p>
      </section>

      {/* Custom Components Example with @ */}
      <section style={{ marginBottom: '40px' }}>
        <h2>5. Teams with Custom Components (@ trigger)</h2>
        <p>Advanced styling and custom dropdown items</p>
        <MentionInput
          options={teams}
          value={selectedTeams}
          onChange={setSelectedTeams}
          placeholder="Type @ to mention teams..."
          customBadge={CustomBadge}
          customSuggestion={CustomSuggestion}
          customDropdownItem={CustomDropdownItem}
        />
        <p><strong>Selected teams:</strong> {selectedTeams.join(', ')}</p>
      </section>

      {/* Multiple triggers comparison */}
      <section style={{ marginBottom: '40px' }}>
        <h2>6. Trigger Comparison</h2>
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div>
            <h4>@ for Users</h4>
            <MentionInput
              options={users.slice(0, 3)}
              value={[]}
              onChange={() => {}}
              placeholder="Type @ for users..."
            />
          </div>
          <div>
            <h4># for Tags</h4>
            <MentionInput
              options={hashtags.slice(0, 3)}
              value={[]}
              onChange={() => {}}
              trigger="#"
              placeholder="Type # for tags..."
              customBadge={HashtagBadge}
            />
          </div>
          <div>
            <h4>/ for Commands</h4>
            <MentionInput
              options={slashCommands.slice(0, 3)}
              value={[]}
              onChange={() => {}}
              trigger="/"
              placeholder="Type / for commands..."
              customBadge={CommandBadge}
              showSuggestions={false}
            />
          </div>
        </div>
      </section>

      {/* Custom styling example */}
      <section style={{ marginBottom: '40px' }}>
        <h2>7. Custom Styling with @ trigger</h2>
        <MentionInput
          options={users}
          value={[]}
          onChange={() => {}}
          placeholder="Beautifully styled mention input..."
          classNames={customClassNames}
        />
      </section>

      <style>{`
        /* Original custom badge styles */
        .custom-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .custom-remove-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }

        .custom-remove-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Hashtag styles */
        .hashtag-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
        }

        .hashtag-symbol {
          font-weight: bold;
          font-size: 14px;
        }

        .hashtag-remove-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          margin-left: 4px;
        }

        .hashtag-remove-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Command badge styles */
        .command-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: linear-gradient(135deg, #2d3748, #4a5568);
          color: white;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid #4a5568;
        }

        .command-slash {
          font-weight: bold;
          color: #63b3ed;
          font-size: 14px;
        }

        .command-remove-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          margin-left: 4px;
        }

        .command-remove-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Channel badge styles */
        .channel-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: linear-gradient(135deg, #4ecdc4, #44a08d);
          color: white;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 500;
        }

        .channel-symbol {
          font-weight: bold;
          font-size: 14px;
        }

        .channel-remove-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          margin-left: 4px;
        }

        .channel-remove-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Suggestion styles */
        .custom-suggestion {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f8f9fa;
          border: 2px dashed #dee2e6;
          border-radius: 15px;
          color: #6c757d;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .custom-suggestion:hover {
          background: #e9ecef;
          border-color: #adb5bd;
          color: #495057;
        }

        .suggestion-plus {
          font-size: 12px;
        }

        /* Dropdown item styles */
        .custom-dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
          border-bottom: 1px solid #f1f3f4;
        }

        .custom-dropdown-item:last-child {
          border-bottom: none;
        }

        .custom-dropdown-item:hover,
        .custom-dropdown-item.active {
          background: #f8f9fa;
        }

        .hashtag-dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
          border-bottom: 1px solid #ffe0e0;
        }

        .hashtag-dropdown-item:last-child {
          border-bottom: none;
        }

        .hashtag-dropdown-item:hover,
        .hashtag-dropdown-item.active {
          background: #fff5f5;
        }

        .item-icon {
          font-size: 18px;
        }

        .item-content {
          flex: 1;
        }

        .item-label {
          font-weight: 500;
          color: #212529;
        }

        .item-value {
          font-size: 12px;
          color: #6c757d;
        }

        /* Container styles */
        .my-mention-container {
          border: 2px solid #e3f2fd;
          border-radius: 12px;
          background: #fafafa;
          padding: 4px;
        }

        .my-selected-container {
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          min-height: 48px;
          padding: 12px;
        }

        .my-input {
          font-size: 16px;
          color: #2c3e50;
        }

        .my-dropdown {
          border: 2px solid #e3f2fd;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        /* Hashtag container styles */
        .hashtag-container {
          border: 2px solid #ffebee;
          border-radius: 12px;
          background: #fdf2f2;
          padding: 4px;
        }

        .hashtag-selected-container {
          background: white;
          border: 1px solid #ffcdd2;
          border-radius: 8px;
          min-height: 48px;
          padding: 12px;
        }

        .hashtag-input {
          font-size: 16px;
          color: #d32f2f;
        }

        .hashtag-dropdown {
          border: 2px solid #ffebee;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(244, 67, 54, 0.15);
        }

        /* Command container styles */
        .command-container {
          border: 2px solid #e8f4fd;
          border-radius: 12px;
          background: #f7fafc;
          padding: 4px;
        }

        .command-selected-container {
          background: white;
          border: 1px solid #cbd5e0;
          border-radius: 8px;
          min-height: 48px;
          padding: 12px;
        }

        .command-input {
          font-size: 16px;
          color: #2d3748;
          font-family: 'Monaco', 'Menlo', monospace;
        }

        .command-dropdown {
          border: 2px solid #e8f4fd;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(45, 55, 72, 0.15);
        }

        /* Section headers */
        h2 {
          color: #2d3748;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }

        h4 {
          color: #4a5568;
          margin-bottom: 8px;
        }

        p {
          color: #718096;
          margin-bottom: 12px;
        }

        section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default MentionInputExample;