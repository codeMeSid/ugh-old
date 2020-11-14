import React, { useState } from "react";
import { AiFillFacebook, AiFillLinkedin, AiFillTwitterSquare, AiFillYoutube } from "react-icons/ai";
import { FaDiscord, FaTrash } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import ProgressButton from "../../components/button/progress";
import FileInput from "../../components/input/file";
import Input from "../../components/input/input";
import Select from "../../components/input/select";
import MainLayout from "../../components/layout/mainlayout";
import Table from "../../components/table";
import { serverRequest } from "../../hooks/server-request";
import { useRequest } from "../../hooks/use-request";
import Router from 'next/router'

const SponsorDetail = ({ sponsor, errors }) => {
    const [messages, setMessages] = useState(errors);
    const [name, setName] = useState(sponsor?.name || "");
    const [website, setWebsite] = useState(sponsor?.website || "");
    const [imageUrl, setImageUrl] = useState(sponsor?.imageUrl || "");
    const [link, setLink] = useState("");
    const [socialList, setSocialList] = useState(sponsor?.links || []);
    const [social, setSocial] = useState("facebook")
    const urlRegex = new RegExp("(https|http)(:\/\/)(ww[a-z0-9]?[.])([a-zA-z0-9]*)([.][a-z]*)+");
    const socialAddHandler = () => {
        if (!link) return;
        if (!urlRegex.test(link)) return setMessages([{ message: "Invalid url format" }])
        setSocialList([...socialList, { name: social, href: link }]);
        setSocial("facebook");
        setLink("")
    }

    const onInputHandler = (name, val) => {
        switch (name) {
            case "name": return setName(val);
            case "website": return setWebsite(val);
            case "imageUrl": return setImageUrl(val);
            case "link": return setLink(val);
        }
    }

    const { doRequest } = useRequest({
        url: `/api/ugh/sponsor/update/detail/${sponsor.sponsorId}`, body: {
            name,
            website,
            imageUrl,
            links: socialList
        },
        method: "put",
        onError: (data) => setMessages(data),
        onSuccess: () => {
            setMessages([{ message: "Data update successful", type: "success" }]);
            setTimeout(() => Router.push("/sponsors"), 5000);
        }
    })

    return <MainLayout messages={messages}>
        <div style={{ margin: "5rem auto" }}>
            <h1 style={{ textAlign: "center" }}>New Sponsor</h1>
            <div className="detail">
                <div className="row">
                    <div className="col">
                        <Input placeholder="Name" value={name} name="name" onChange={onInputHandler} />
                    </div>
                    <div className="col">
                        <Input placeholder="website" value={website} name="website" type="url" onChange={onInputHandler} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Input placeholder="phone" value={sponsor?.contact?.phone} disabled />
                    </div>
                    <div className="col">
                        <Input placeholder="Email" value={sponsor?.contact?.email} disabled />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Input placeholder="sponsorship package" value={sponsor?.sponsorPack?.name.toUpperCase()} disabled />
                    </div>
                    <div className="col">
                        <Input style={{ height: 35 }} placeholder="sponsorship color" type="color" value={sponsor?.sponsorPack?.color} disabled />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Input placeholder="duration" value={sponsor?.sponsorPack?.pack?.duration} disabled />
                    </div>
                    <div className="col">
                        <Input placeholder="price" value={sponsor?.sponsorPack?.pack?.price} disabled />
                    </div>
                </div>
                <div style={{ minWidth: 400, maxWidth: 600, margin: "0 auto" }}>
                    <FileInput placeholder="Logo" value={imageUrl} name="imageUrl" showImage onChange={onInputHandler} />
                </div>
                <div className="row">
                    <div className="col">
                        {socialList.length > 0 && <Table
                            data={socialList.map(({ name, href }, index) => [
                                <span style={{ textTransform: "capitalize" }}>{name}</span>,
                                <a style={{ color: "blue" }} href={href} target="_blank">click here</a>,
                                <FaTrash onClick={() => setSocialList(socialList.filter((s, i) => i !== index))} />
                            ])}
                            headers={[{ isResponsive: false, text: "social media" }, { isResponsive: false, text: "link" }, { isResponsive: false, text: "remove" }]}
                            hasLoader />}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Select value={social} name="social" placeholder="Social media" onSelect={(A) => setSocial(A.currentTarget.value)} options={[
                            "facebook",
                            "twitter",
                            "discord",
                            "youtube",
                            'twitch',
                            "instagram",
                            "linkedin"]
                            .map((name) => <option key={name} value={name} style={{ textTransform: "capitalize" }}>
                                {name}
                            </option>)} />
                    </div>
                    <div className="col">
                        <Input placeholder="link" value={link} name="link" type="url" onChange={onInputHandler} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <IoIosAddCircleOutline onClick={socialAddHandler} style={{ fontSize: 28, cursor: "pointer" }} />
                    </div>
                </div>

                <div className="row">
                    <ProgressButton type="whatsapp" text="Submit" size="large" onPress={async (_, next) => {
                        if (!sponsor) return setMessages([{ message: "Invalid Link! Kindly ask admin to generate new link" }]);
                        if (!urlRegex.test(website)) {
                            next();
                            return setMessages([{ message: "Invalid website url format" }])
                        }
                        await doRequest()
                        next()
                    }} />
                </div>
            </div>
        </div>
    </MainLayout>
}


SponsorDetail.getInitialProps = async (ctx) => {
    const { sponsorId } = ctx.query;
    const { data, errors } = await serverRequest(ctx, { url: `/api/ugh/sponsor/fetch/${sponsorId}`, body: {}, method: "get" })
    return { sponsor: data || {}, errors: errors || [] }
}

export default SponsorDetail;