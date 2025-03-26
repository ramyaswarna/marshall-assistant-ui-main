const ChatSendBoxSuggestions = (props: {
  suggestions: string[];
  submitMessage: (message: string) => void;
}) => {
  if (props.suggestions.length === 0) return <></>;

  return (
    <ul className="chat__send-box__suggestions">
      {props.suggestions.map((suggestion, index) => (
        <li
          key={index}
          value={suggestion}
          tabIndex={0}
          onClick={() => props.submitMessage(suggestion)}
          onKeyDown={(e) => {
            if (e.key === "Enter") props.submitMessage(suggestion);
          }}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
};

export default ChatSendBoxSuggestions;
