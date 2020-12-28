import { SponsorDoc } from "../../../server/models/sponsor";
import {
  FaLinkedin,
  FaTwitch,
  FaInstagram,
  FaYoutube,
  FaFacebookSquare,
  FaTwitter,
  FaDiscord,
} from "react-icons/fa";
import React from "react";
const iconLinks = {
  linkedin: <FaLinkedin />,
  twitch: <FaTwitch />,
  instagram: <FaInstagram />,
  youtube: <FaYoutube />,
  facebook: <FaFacebookSquare />,
  twitter: <FaTwitter />,
  discord: <FaDiscord />,
};

const SponsorCard = ({ sponsor }: { sponsor: SponsorDoc }) => (
  <div className="sponsors__card">
    <div className="sponsors__card__image">
      <img src={sponsor.imageUrl} alt={sponsor.contact.email} />
    </div>
    <a href={sponsor.website} className="sponsors__card__name" target="_blank">
      {sponsor.name}
    </a>
    <div className="sponsors__card__links">
      {sponsor.links.map((link) => {
        return (
          <a
            key={Math.random()}
            className="sponsors__card__links__item"
            style={{ margin: 5 }}
            href={link.href}
            target="_blank"
          >
            {iconLinks[link.name]}
          </a>
        );
      })}
    </div>
  </div>
);

export default SponsorCard;
