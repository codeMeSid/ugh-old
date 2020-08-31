import { AwesomeButton } from "react-awesome-button";
const Button = ({ text, ...props }) => (
  <AwesomeButton {...props} >
    {text}
  </AwesomeButton>
);
export default Button;
