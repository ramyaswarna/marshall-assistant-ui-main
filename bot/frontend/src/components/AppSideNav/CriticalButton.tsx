import { Button } from "@carbon/react";
import { WarningFilled } from "@carbon/icons-react";

interface CriticalButtonPropsType {
  buttonTitle: string;
  onClick: () => void;
}

const CriticalButton = (props: CriticalButtonPropsType) => {
  const handleClick = () => props.onClick();

  return (
    <Button
      kind="danger--tertiary"
      size="sm"
      onClick={handleClick}
      style={{ display: "flex", alignItems: "center" }}
    >
      <span style={{ paddingRight: "8px" }}>{props.buttonTitle}</span>
      <WarningFilled />
    </Button>
  );
};

export default CriticalButton;
