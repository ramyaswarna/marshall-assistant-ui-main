import React from "react";
import { AccordionItem } from "@carbon/react";

interface SideNavSectionDataType {
  title: string;
  content: Array<{
    label: string;
    children: Array<{ label: string }>;
  }>;
}

interface AppSideNavSectionProps {
  onSelect: (value: string) => void;
  sectionData: SideNavSectionDataType;
  selectedOption: string;
  children?: React.ReactNode;
}

const AppSideNavSection: React.FC<AppSideNavSectionProps> = ({
  onSelect,
  sectionData,
  selectedOption,
  children,
}) => {
  return (
    <div className="side-nav__section">
      <li className="accordion-summary-and-time">{sectionData.title}</li>
      {sectionData.content.map((item) => (
        <AccordionItem key={item.label} title={item.label}>
          {item.children.map((child) => (
            <button
              key={child.label}
              onClick={() => onSelect(child.label)}
              className={`option-button ${
                child.label === selectedOption ? "selected-option" : ""
              }`}
            >
              {child.label}
            </button>
          ))}
          {children}
        </AccordionItem>
      ))}
    </div>
  );
};

export default AppSideNavSection;
