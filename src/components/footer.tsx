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
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ marginRight: 5 }}>
                        <SocialButton href="https://www.facebook.com/gamingugh/" target="_blank" size="icon" type="facebook" />
                    </div>
                    <div style={{ marginRight: 5 }}>
                        <SocialButton href="https://twitter.com/ultimat79668532?s=11" target="_blank" size="icon" type="twitter" />
                    </div>
                    <div style={{ marginRight: 5 }}>
                        <Button href="https://twitch.tv/ultimategamershub" target="_blank" size="icon" text={<FaTwitch />} />
                    </div>
                    <div>
                        <SocialButton href="https://www.youtube.com/channel/UCrRonf3Q69wDBnxnM1BOHog?view_as=subscriber" target="_blank" size="icon" type="youtube" />
                    </div>
                </div>
            </div>
            <div className="footer__l2__item">
                <Link href="/tac">
                    <a className="footer__l2__item__link" target="_blank">Terms Of Use </a>
                </Link>
                &
                <Link href="/privacy">
                    <a className="footer__l2__item__link" target="_blank"> Privacy Policy</a>
                </Link>

            </div>
        </div>
    </footer>
}

export default Footer;