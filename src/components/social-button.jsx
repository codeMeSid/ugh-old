import { AwesomeButtonSocial } from "react-awesome-button";
const SocialButton = ({ type, ...props }) => (
  <AwesomeButtonSocial type={type} {...props} />
);
export default SocialButton;
