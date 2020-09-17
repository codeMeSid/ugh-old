import { useState } from 'react';
import SideLayout from "../../../components/layout/sidelayout";
import Input from "../../../components/input/input";
import FileInput from '../../../components/input/file';
import { AiOutlineAppstoreAdd } from 'react-icons/ai';
import { serverRequest } from '../../../hooks/server-request';
import { ConsoleDoc } from '../../../../server/models/console';
import Select from '../../../components/input/select';
import Option from '../../../components/input/option';
import ProgressButton from '../../../components/button/progress';
import { useRequest } from '../../../hooks/use-request';
import Router from 'next/router';

const AddGame = ({ consoles, errors }: { consoles: ConsoleDoc[], errors: any }) => {
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [console, setConsole] = useState(consoles?.length >= 1 ? consoles[0]?.name : "");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [participant, setParticipant] = useState(5);
    const [participants, setParticipants] = useState([1]);
    const [groups, setGroups] = useState([]);
    const [group, setGroup] = useState("duo");
    const [gParticipant, setGParticipant] = useState(2);
    const [messages, setMessages] = useState(errors);
 
    const { doRequest } = useRequest({
        url: "/api/ugh/game/add", body: {
            name,
            imageUrl,
            console,
            thumbnailUrl,
            participants,
            groups,
        },
        method: "post",
        onSuccess: () => Router.replace("/admin/games"),
        onError: (errors) => setMessages(errors)
    })

    const onChangeHandler = (name: string, val: any) => {
        switch (name) {
            case 'name': return setName(val);
            case 'imageUrl': return setImageUrl(val);
            case 'thumbnailUrl': return setThumbnailUrl(val);
            case 'participant': return setParticipant(val);
            case 'group': return setGroup(val);
            case 'gParticipant': return setGParticipant(val);
        }
    }

    const onParticipantAddHandler = () => {
        const pIndex = participants.indexOf(participant);
        if (pIndex === -1) {
            const uP = [...participants];
            uP.push(participant);
            setParticipants(uP);
        }
    }

    const onGroupAddHandler = () => {
        const gIndex = groups.findIndex(g => g.name === group || g.participants === gParticipant);
        if (gIndex === -1) {
            const gP = [...groups];
            gP.push({ name: group, participants: gParticipant });
            setGroups(gP);
            setGroup("duo");
            setGParticipant(2);
        }
    }

    const onPillClickHanlder = (index: number) => {
        const pills = [...participants];
        pills.splice(index, 1);
        setParticipants(pills);
    }
    const onPillGroupClickHanlder = (index: number) => {
        const pills = [...groups];
        pills.splice(index, 1);
        setGroups(pills);
    }


    return <SideLayout messages={messages} title="add game">
        <div className="detail">
            <div className="row">
                <Input placeholder="name" name="name" value={name} onChange={onChangeHandler} />
            </div>
            <div className="row">
                <Select
                    value={console}
                    name="console"
                    onSelect={e => setConsole(e.currentTarget.value)}
                    placeholder="console"
                    options={consoles?.map((console: ConsoleDoc) => <Option key={console.name} value={console.name} display={console.name.toUpperCase()} />)} />
            </div>
            <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
                <FileInput name="imageUrl" placeholder="main image" onChange={onChangeHandler} />
            </div>
            <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
                <FileInput name="thumbnailUrl" placeholder="thmbnail image" onChange={onChangeHandler} />
            </div>
            <div className="row">
                <div className="col">
                    <Input placeholder="participant" name="participant" value={participant} type="number" onChange={onChangeHandler} />
                </div>
                <div className="col">
                    <AiOutlineAppstoreAdd style={{ fontSize: "2.6rem", cursor: "pointer" }} onClick={onParticipantAddHandler} />
                </div>
            </div>
            <div className="row">
                {
                    participants.map((val, index) => {
                        return <div onClick={() => onPillClickHanlder(index)} className="pill" key={val}>{val}</div>
                    })
                }
            </div>
            <div className="row">
                <div className="col">
                    <Input placeholder="group" name="group" onChange={onChangeHandler} value={group} />
                </div>
                <div className="col">
                    <Input type="number" placeholder="group participant" name="gParticipant" onChange={onChangeHandler} value={gParticipant} />
                </div>
            </div>
            <div className="row">
                <AiOutlineAppstoreAdd style={{ fontSize: "2.6rem", cursor: "pointer" }} onClick={onGroupAddHandler} />
            </div>
            <div className="row">
                {
                    groups.map((val, index) => {
                        return <div onClick={() => onPillGroupClickHanlder(index)} className="pill" key={val}>{val.name}-{val.participants}</div>
                    })
                }
            </div>
            <div className="row">
                <ProgressButton text="Submit" type="link" size="large" onPress={async (_, next) => {
                    await doRequest();
                    next();
                }} />
            </div>
        </div>
    </SideLayout>
}


AddGame.getInitialProps = async (ctx) => {
    const { data, errors } = await serverRequest(ctx, {
        url: "/api/ugh/console/fetch/active",
        method: "get",
        body: {}
    });
    return { consoles: data || [], errors: errors || [] }
}

export default AddGame;

// console