import { AwesomeButtonProgress } from "react-awesome-button";
const ProgressButton = ({ text, ...props }) => (
  <AwesomeButtonProgress {...props} name="UlitmateGamersHub Progress Button">
    {text}
  </AwesomeButtonProgress>
);
export default ProgressButton;
