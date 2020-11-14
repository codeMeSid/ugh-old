import { useRequest } from "../../hooks/use-request";
import { useState, useEffect } from 'react';
import { SponsorDoc } from "../../../server/models/sponsor";

const SponsorSlider = () => {
    const [sponsors, setSponsors] = useState([])
    const { doRequest } = useRequest({
        url: "/api/ugh/sponsor/fetch/active",
        body: {},
        method: "get",
        onSuccess: (data) => setSponsors(data)
    });
    useEffect(() => { doRequest() }, []);
    const sponsorCardStyle = (sponsor: SponsorDoc) =>
        ({
            border: `2.5px solid ${sponsor.sponsorPack.color}`,
            backgroundImage: `url(${sponsor.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        })
    return <section className="sponsor-slider">
        <div className="sponsor-slider__container">

            {sponsors.map((sponsor: SponsorDoc) => {
                return (
                    <a href={sponsor.website} style={sponsorCardStyle(sponsor)} target="_blank" className="sponsor-slider__card" key={Math.random()}>
                        <span className="sponsor-slider__card__name">{sponsor.name}</span>
                    </a>)
            })}
        </div>
    </section>
}

export default SponsorSlider;