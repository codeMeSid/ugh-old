import Link from "next/link";
import SocialButton from "./button/social";
import Button from "./button/main";
import { FaTwitch } from 'react-icons/fa';

const Footer = () => {
    return <footer className="footer">
        <div className="footer__l1">
            Ultimate Gamers Hub Entertainment Pvt Ltd. © 2019
        </div>
        <div className="footer__l2">
            <div className="footer__l2__item">
                <div style={{ marginBottom: ".4rem" }}>Follow Us</div>
                <div>
                    <SocialButton href="https://www.facebook.com/ultimategamershub/" size="icon" type="facebook" />
                    <SocialButton href="http://twitter.com/" size="icon" type="twitter" />
                    <Button href="https://www.twitch.tv/cricket" size="icon" text={<FaTwitch />} />
                    <SocialButton href="https://www.youtube.com/channel/UCrRonf3Q69wDBnxnM1BOHog?view_as=subscriber" size="icon" type="youtube" />
                </div>
            </div>
            <div className="footer__l2__item">
                <Link href="/tac">
                    <a className="footer__l2__item__link">Terms Of Use & Privacy Policy</a>
                </Link>
            </div>
        </div>
    </footer>
}

export default Footer;