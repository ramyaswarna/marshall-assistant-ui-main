import React, { useState, useEffect, useCallback } from "react";
import "./AppSideNav.scss";
import {
  SideNav,
  Accordion,
  DatePicker,
  DatePickerInput,
  AccordionItem,
  RadioButtonGroup,
  RadioButton,
  Checkbox,
} from "@carbon/react";
import AppSideNavSection from "./AppSideNavSection";
import AppSideNavNewsfeed from "./AppSideNavNewsfeed";
import { TOptions } from "i18next";
import { useTranslation } from "react-i18next";
import { Button } from "@carbon/react";
import AppSideWarningText from "./AppSideWarningText";
import { getPatientsList } from "../../api/api";
import {
  NewsfeedDataType,
  NewsfeedButtonsType,
  SideNavSectionDataType,
  Patient,
  AppSideNavProps
} from '../types';

const AppSideNav: React.FC<AppSideNavProps> = ({
  onRegenerateSummary,
  isLoading,
  error,
  selectedPatient,
  onPatientSelect,
  activePatient,
  verbosityLevel,
}) => {
  const { t } = useTranslation("sidenav");

  useState<string>("Moderate-Detail");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeFrameOption, setTimeFrameOption] =
    useState<string>("Past 6 months");
  const [datePickerKey, setDatePickerKey] = useState(0);
  const [identifyIndicators, setIdentifyIndicators] = useState<boolean>(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState<string | null>(null);

  const [selectedVerbosity, setSelectedVerbosity] = useState(() => {
    switch (verbosityLevel) {
      case 1:
        return "Concise";
      case 2:
        return "Moderate-Detail";
      case 3:
        return "High-Detail";
      default:
        return "Concise";
    }
  });

  const handlePatientChange = useCallback(
    (id: string) => {
      onPatientSelect(id);
      console.log("Watson Assistant: Patient selection changed to", id);
    },
    [onPatientSelect]
  );

  const verbosityToNumber = (verbosity: string): number => {
    switch (verbosity) {
      case "Concise":
        return 1;
      case "Moderate-Detail":
        return 2;
      case "High-Detail":
        return 3;
      default:
        return 1;
    }
  };

  const newsfeedContent: NewsfeedDataType = {
    label: t("trending.title") as string,
    children: (t("trending.news", { returnObjects: true }) as Array<{ feed: string }>),
    critical: (t("trending.critical", { returnObjects: true }) as string[]).map((btn: string) => ({
      message: btn,
      senderID: "user1",
    })),
  };

  const summaryComplexityContent: SideNavSectionDataType = {
    title: String(t("summaryComplexityContent.title")),
    content: (t("summaryComplexityContent.content", { returnObjects: true }) as Array<{
      label: string;
      children: Array<{ label: string }>;
    }>) || [],
  };

  const timeFrameContent: SideNavSectionDataType = {
    title: String(t("timeFrameContent.title")),
    content: (t("timeFrameContent.content", { returnObjects: true }) as Array<{
      label: string;
      children: Array<{ label: string }>;
    }>) || [],
  }

  const handleVerbosityChange = useCallback((value: string) => {
    setSelectedVerbosity(value);
    const numericValue = verbosityToNumber(value);
    console.log(`Selected verbosity: ${value} (Level ${numericValue})`);
  }, []);

  const handleDateChange = useCallback((dates: Date[]) => {
    const selectedDate = dates[0];
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setTimeFrameOption("Custom Date");
      console.log(`Selected date: ${selectedDate.toISOString().split("T")[0]}`);
    } else {
      setSelectedDate(null);
      console.log("Date cleared");
    }
  }, []);

  const handleTimeFrameSelect = useCallback((value: string) => {
    setTimeFrameOption(value);
    if (value === "Past 6 months") {
      setSelectedDate(null);
      setDatePickerKey((prevKey) => prevKey + 1);
    } else if (value === "Custom Date") {
    } else {
      setSelectedDate(null);
      setDatePickerKey((prevKey) => prevKey + 1);
    }
  }, []);

  const handleRegenerateClick = useCallback(() => {
    const numericValue = verbosityToNumber(selectedVerbosity);
    let formattedDate: string | null = null;

    if (timeFrameOption === "Past 6 months") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      formattedDate = sixMonthsAgo.toISOString().split("T")[0];
    } else if (selectedDate) {
      formattedDate = selectedDate.toISOString().split("T")[0];
    }

    console.log(
      `Regenerating with verbosity: ${numericValue}, Date: ${
        formattedDate || "No date selected"
      }, Identify Indicators: ${identifyIndicators}`
    );

    onRegenerateSummary(numericValue, identifyIndicators, formattedDate);
  }, [
    selectedVerbosity,
    selectedDate,
    timeFrameOption,
    identifyIndicators,
    onRegenerateSummary,
  ]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setPatientsLoading(true);
        const patientsList = await getPatientsList();
        setPatients(patientsList);
        setPatientsError(null);
      } catch (error) {
        setPatientsError("Failed to load patients list");
        console.error("Error loading patients:", error);
      } finally {
        setPatientsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <SideNav
      className="side-nav"
      aria-label="Side navigation"
      isFixedNav
      isPersistent
      expanded
      isChildOfHeader={false}
    >
      <div className="patient-overview">
        <Accordion size="lg" className="accordion-side-nav">
          <AppSideNavNewsfeed newsfeedData={newsfeedContent} />
          <h3 className="section-title">Choose Your Patient</h3>
          <AccordionItem title="Select Patient">
            <div className="patient-selection">
              {patientsLoading ? (
                <div>Loading patients...</div>
              ) : patientsError ? (
                <div className="error-message">{patientsError}</div>
              ) : (
                <RadioButtonGroup
                  name="patient"
                  valueSelected={activePatient}
                  onChange={handlePatientChange}
                  disabled={isLoading}
                >
                  {patients.map((patient) => (
                    <RadioButton
                      key={patient.id}
                      labelText={patient.name}
                      value={patient.id.toString()}
                      id={`patient-${patient.id}`}
                      className={
                        activePatient === patient.id.toString()
                          ? "active-patient"
                          : ""
                      }
                    />
                  ))}
                </RadioButtonGroup>
              )}
            </div>
          </AccordionItem>
          <AppSideNavSection
            onSelect={handleVerbosityChange}
            sectionData={summaryComplexityContent}
            selectedOption={selectedVerbosity}
          />
          <AppSideNavSection
            onSelect={handleTimeFrameSelect}
            sectionData={timeFrameContent}
            selectedOption={timeFrameOption}
          >
            <DatePicker
              key={datePickerKey}
              datePickerType="single"
              onChange={handleDateChange}
              maxDate={new Date().toISOString()}
              value={selectedDate ? [selectedDate] : undefined}
              className="full-width-date-picker"
            >
              <DatePickerInput
                id="date-picker-input"
                placeholder="yyyy-mm-dd"
                labelText="Select a date"
                type="text"
                value={
                  selectedDate ? selectedDate.toISOString().split("T")[0] : ""
                }
                disabled={isLoading}
              />
            </DatePicker>
          </AppSideNavSection>
        </Accordion>
        <div className="regenerate-options">
          <Checkbox
            id="identify-indicators"
            labelText="Show Potential Undiagnosed Conditions"
            checked={identifyIndicators}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked;
              console.log("Indicator checkbox changed:", isChecked);
              setIdentifyIndicators(isChecked);
            }}
            disabled={isLoading}
          />
        </div>

        <div className="regenerate-button-container">
          <Button
            kind="primary"
            size="lg"
            onClick={handleRegenerateClick}
            className="button-side-nav"
            disabled={isLoading}
          >
            {isLoading || error ? "Generate" : "Regenerate"}
          </Button>
        </div>
      </div>
      <AppSideWarningText />
    </SideNav>
  );
};

export default React.memo(AppSideNav);
