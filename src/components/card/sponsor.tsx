import { SponsorDoc } from "../../../server/models/sponsor";
import { FaLinkedin, FaTwitch, FaInstagram, FaYoutube, FaFacebookSquare, FaTwitter } from "react-icons/fa";
const iconLinks = {
    linkedin: (<FaLinkedin />),
    twitch: (<FaTwitch />),
    instagram: (<FaInstagram />),
    youtube: (<FaYoutube />),
    facebook: (<FaFacebookSquare />),
    twitter: (<FaTwitter />),
};

const SponsorCard = ({ sponsor }: { sponsor: SponsorDoc }) =>
    <div className="sponsors__card">
        <div className="sponsors__card__image">
            <img src={sponsor.imageUrl} alt={sponsor.contact.email} />
        </div>
        <a href={sponsor.website} className="sponsors__card__name">{sponsor.name}</a>
        <div className="sponsors__card__links">
            {
                sponsor.links.map(link => {
                    return <a className="sponsors__card__links__item" style={{ margin: 5 }} href={link.href}>
                        {iconLinks[link.name]}
                    </a>
                })
            }
        </div>
    </div>

export default SponsorCard;