import { AwesomeButtonProgress } from "react-awesome-button";
const ProgressButton = ({ text, ...props }) => (
  <AwesomeButtonProgress {...props}>
    {text}
  </AwesomeButtonProgress>
);
export default ProgressButton;
