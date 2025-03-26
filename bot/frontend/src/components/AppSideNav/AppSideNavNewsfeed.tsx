import { NewsfeedButtonsType, NewsfeedDataType } from "../types";

const AppSideNavNewsfeed = (props: {
  newsfeedData: NewsfeedDataType;
}) => {
  return (
    <div className="patient_summary">
      <li className=" cds--accordion__title side-nav__section__heading">
        {props.newsfeedData.label}
      </li>
    </div>
  );
};

export default AppSideNavNewsfeed;
