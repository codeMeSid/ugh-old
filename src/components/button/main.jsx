import { AwesomeButton } from "react-awesome-button";
const Button = ({ text, ...props }) => (
  <AwesomeButton {...props} name="UlitmateGamersHub Button">
    {text}
  </AwesomeButton>
);
export default Button;
