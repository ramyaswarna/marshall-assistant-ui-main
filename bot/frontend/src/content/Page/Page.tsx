import React, { useMemo } from "react";
import "./Page.scss";
import CharlesWillingHeader from "../../assets/images/charles-willing-header.png";
import PeterAndersonHeader from "../../assets/images/anderson-peter-header.png";

interface PageProps {
  children: React.ReactNode;
  className?: string;
  authenticated?: boolean;
  withoutHeader?: boolean;
  selectedPatient?: string;
  onLogout?: () => void;
}

const Page: React.FC<PageProps> = ({
  children,
  className,
  withoutHeader,
  selectedPatient,
  onLogout,
}) => {
  const headerImage = useMemo(() => {
    switch (selectedPatient) {
      case "2":
        return PeterAndersonHeader;
      case "1":
      default:
        return CharlesWillingHeader;
    }
  }, [selectedPatient]);

  return (
    <div className={`page ${className || ""}`}>
      {!withoutHeader && (
        <div className="page__platform-header">
          <img
            src={headerImage}
            alt="Platform Header"
            className="page__platform-image"
          />
          {onLogout && (
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          )}
        </div>
      )}
      <div className="page__content">
        <main className={`page__main ${className || ""}`}>{children}</main>
      </div>
    </div>
  );
};

export default Page;
