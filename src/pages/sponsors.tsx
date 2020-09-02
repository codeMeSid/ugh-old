import { serverRequest } from "../hooks/server-request"
import MainLayout from "../components/layout/mainlayout"
import SponsorCard from "../components/card/sponsor"
import { SponsorDoc } from "../../server/models/sponsor"

const Sponsors = ({ currentUser, sponsors, sponsorships }) => {
    return <MainLayout currentUser={currentUser}>
        <div className="sponsors">
            <div className="sponsors__title">become a sponsor</div>
            <div className="sponsors__new">

            </div>
            <div className="sponsors__list">
                <SponsorCard />
            </div>
        </div>
    </MainLayout>
}

Sponsors.getInitialProps = async (ctx) => {
    const sponsors = await serverRequest(ctx, { url: "/api/ugh/sponsor/fetch/active", body: {}, method: "get" });
    const sponsorships = await serverRequest(ctx, { url: "/api/ugh/sponsorship/fetch/active", body: {}, method: "get" });
    const packSponsors = {};
    Array.from(sponsors.data || []).forEach((sponsor: SponsorDoc) => {
        if (packSponsors[sponsor.sponsorPack.name]) {
            packSponsors[sponsor.sponsorPack.name] = [...packSponsors[sponsor.sponsorPack.name], sponsor];
        } else {
            packSponsors[sponsor.sponsorPack.name] = [sponsor];
        }
    });
    return {
        sponsors: packSponsors,
        sponsorships: sponsorships.data
    }
}

export default Sponsors
// [ { sponsorPack: [Object],
//     name: 'make sense',
//     website: 'www.facebook.com',
//     imageUrl:
//      'https://images.pexels.com/photos/3054218/pexels-photo-3054218.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
//     id: '5f4b1c5ee16513926c65380d' } ],
// sponsorships:
// [ { isActive: true,
//     name: 'golden',
//     color: '#FFD700',
//     packs: [Array],
//     __v: 0,
//     id: '5f4b06d2bf1282851d906b92' },
//   { isActive: true,
//     name: 'silver',
//     color: '#C0C0C0\t',
//     packs: [Array],
//     __v: 0,
//     id: '5f4b0728a94b4085b4330a7c' } ] }
