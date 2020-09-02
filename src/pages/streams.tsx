import { useState, useEffect } from 'react';
import MainLayout from "../components/layout/mainlayout";
import { serverRequest } from "../hooks/server-request";
import { StreamDoc } from "../../server/models/stream";
import SocialButton from '../components/button/social';
import Button from '../components/button/main';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsPlayFill } from 'react-icons/bs';
import { FaTwitch } from 'react-icons/fa';

const Streams = ({ currentUser, streams, errors }) => {
    const [streamData] = useState(streams);
    const [streamOption, setStreamOption] = useState("all");
    const [streamArray, setStreamArray] = useState([]);
    useEffect(() => {
        const streamDataArray = [];
        if (streamOption === "all")
            Object.values(streamData)
                .forEach((data: Array<any>) => {
                    streamDataArray.push(...data);
                })
        else streamDataArray.push(...streamData[streamOption]);
        setStreamArray(streamDataArray);
        console.log({ streamDataArray });
    }, [streamOption]);

    const getSocialButton = (type: string) => {
        switch (type) {
            case "twitch":
                return <Button onPress={() => setStreamOption(type)} size="icon" type="secondary" text={<FaTwitch />} />
            default:
                return <SocialButton onPress={() => setStreamOption(type)} size="icon" type={type} />
        }
    }

    return <MainLayout currentUser={currentUser}>
        <section className="streams">
            <div className="streams__title">Streams</div>
            <div className="streams__subtitle">This is where you can browse through our streams</div>
            <div className="streams__social">
                <div className="streams__social__button">
                    <Button type="link" size="icon" onPress={() => setStreamOption("all")} text={<AiOutlineMenu />} />
                </div>
                {
                    Object.keys(streamData).map(data => {
                        return <div key={data} className="streams__social__button">
                            {getSocialButton(data)}
                        </div>
                    })
                }
            </div>
            <div className="streams__list">
                {streamArray.map((data: StreamDoc) => {
                    return <a href={data.href} target="_blank" className="streams__item">
                        <img src={data.imageUrl} alt={data.name} className="streams__item__image" />
                        <div className="streams__item__name">{data.name}</div>
                        <div className="streams__item__game">{data.game}</div>
                        <BsPlayFill className="streams__item__icon" />
                    </a>
                })}
            </div>

        </section>
    </MainLayout>
}

Streams.getInitialProps = async (ctx) => {
    const { data, errors } = await serverRequest(ctx, { url: "/api/ugh/stream/fetch/active", body: {}, method: "get" });
    const streams = {};
    Array.from(data || []).forEach((stream: StreamDoc) => {
        const streamObj = {
            id: stream.id,
            game: stream.game,
            href: stream.href,
            imageUrl: stream.imageUrl,
            name: stream.name
        }
        if (streams[stream.social]) {
            streams[stream.social] = [...streams[stream.social], streamObj];
        } else {
            streams[stream.social] = [streamObj];
        }
    })
    return {
        streams,
        errors

    }
}

export default Streams;