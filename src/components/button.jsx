import { AwesomeButton } from "react-awesome-button";
const Button = ({ text, ...props }) => (
  <AwesomeButton type="primary" {...props}>
    {text}
  </AwesomeButton>
);
export default Button;
