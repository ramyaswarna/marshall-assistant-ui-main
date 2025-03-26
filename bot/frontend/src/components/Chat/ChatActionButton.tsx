import { Button } from "@carbon/react";

interface ChatActionButtonPropsType {
  buttonTitle: string;
  onClick: () => void;
}

const ChatActionButton = (props: ChatActionButtonPropsType) => {
  const handleClick = () => props.onClick();

  return (
    <Button
      kind="tertiary"
      size="sm"
      onClick={handleClick}
      className="chat__messages__item--action-button"
    >
      {props.buttonTitle}
    </Button>
  );
};

export default ChatActionButton;
