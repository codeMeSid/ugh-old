import { useState } from 'react';
import { serverRequest } from "../hooks/server-request";
import MainLayout from "../components/layout/mainlayout";
import SponsorCard from "../components/card/sponsor";
import { SponsorDoc } from "../../server/models/sponsor";
import Input from "../components/input/input";
import { SponsorshipDoc } from "../../server/models/sponsorship";
import Select from '../components/input/select';
import Option from '../components/input/option';
import ProgressButton from '../components/button/progress';
import { useRequest } from '../hooks/use-request';

const Sponsors = ({ sponsors, sponsorships }
    : { sponsors: any, sponsorships: Array<SponsorshipDoc> }) => {
    const [sponsorshipIndex, setSponsorshipIndex] = useState(0);
    const [packIndex, setPackIndex] = useState(0);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const { doRequest } = useRequest({
        url: "/api/ugh/sponsor/add",
        body: {
            email,
            phone,
            duration: sponsorships[sponsorshipIndex].packs[packIndex].duration,
            price: sponsorships[sponsorshipIndex].packs[packIndex].price,
            name: sponsorships[sponsorshipIndex].name,
            color: sponsorships[sponsorshipIndex].color,
            message
        },
        method: "post",
        onSuccess: () => {
            setMessages([{ message: "Request submitted", type: "success" }])
            setSponsorshipIndex(0);
            setPackIndex(0);
            setEmail("");
            setPhone("");
            setMessage("");
        },
        onError: (errors) => setMessages(errors)
    })
    const onChangeHandler = (name: string, value: string) => {
        switch (name) {
            case "email": return setEmail(value);
            case "phone": return setPhone(value);
            case "message": return setMessage(value);
        }
    }
    const onSelectHandler = (e) => {
        const val = `${e.currentTarget.value}`.split(",").map(num => parseInt(num));
        console.log(val)
        setSponsorshipIndex(val[0]);
        setPackIndex(val[1]);
    }
    return <MainLayout messages={messages}>
        <div className="sponsors">
            <div className="sponsors__head">
                <div className="sponsors__title">Sponsor us</div>
                <div className="sponsors__new">
                    <Input name="email" type="email" onChange={onChangeHandler} placeholder="email*" value={email} />
                    <Input name="phone" onChange={onChangeHandler} placeholder="phone(+91)*" value={phone} />
                    <Select
                        onSelect={onSelectHandler}
                        name="pack"
                        value={`${sponsorshipIndex},${packIndex}`}
                        placeholder="Sponsorship Package"
                        options={sponsorships.map((sponsorship, sIndex) => {
                            return sponsorship.packs.map((pack, pIndex) => {
                                return <Option
                                    // style={{ backgroundColor: sponsorship.color }}
                                    key={Math.random()}
                                    display={`${sponsorship.name.toUpperCase()} (${pack.duration} months - ₹${pack.price})`}
                                    value={`${sIndex},${pIndex}`}
                                />
                            })
                        })}
                    />

                    <textarea style={{ width: "100%", minHeight: "10rem", margin: "10px 0", padding: 5 }}
                        placeholder="message"
                        name="message"
                        onChange={(e) => onChangeHandler(e.currentTarget.name, e.currentTarget.value)} />
                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                        <ProgressButton text="Submit" type="link" size="large" onPress={async (_, next) => {
                            await doRequest();
                            next();
                        }} />
                    </div>
                </div>
            </div>

            <div className="sponsors__body">
                <div className="sponsors__body__container">
                    {
                        Object.keys(sponsors).map(sponsorKey => {
                            return <div key={sponsorKey} className="sponsors__group">
                                <div className="sponsors__group__title">{sponsorKey} members</div>
                                <div className="sponsors__group__list">
                                    {
                                        Array.from(sponsors[sponsorKey]).map((sponsor: SponsorDoc) => {
                                            return <SponsorCard key={Math.random()} sponsor={sponsor} />
                                        })
                                    }
                                </div>
                            </div>
                        })
                    }
                </div>
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
        sponsorships: sponsorships.data || []
    }
}

export default Sponsors