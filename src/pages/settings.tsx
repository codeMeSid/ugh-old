import { useState } from 'react'
import MainLayout from "../components/layout/mainlayout";
import CheckInput from "../components/input/checkbox";
import { serverRequest } from '../hooks/server-request';
import { UserDoc } from '../../server/models/user';
import { useRequest } from '../hooks/use-request';
import ProgressButton from '../components/button/progress';

const Settings = ({ user, errors }: { user: UserDoc, errors: any }) => {
    const [newTournamentWasAdded, setNewTournamentWasAdded] = useState(!!user?.settings?.newTournamentWasAdded);
    const [addedTournamentWasWon, setAddedTournamentWasWon] = useState(!!user?.settings?.addedTournamentWasWon);
    const [addedTournamentWillStart, setAddedTournamentWillStart] = useState(!!user?.settings?.addedTournamentWillStart);
    const [addedTournamentProofSent, setAddedTournamentProofSent] = useState(!!user?.settings?.addedTournamentProofSent);
    const [addedTournamentProofDenied, setAddedTournamentProofDenied] = useState(!!user?.settings?.addedTournamentProofDenied);
    const [activityInCreatedTournament, setActivityInCreatedTournament] = useState(!!user?.settings?.activityInCreatedTournament);
    const [messages, setMessages] = useState(errors);

    const { doRequest } = useRequest({
        url: "/api/ugh/user/update/setting",
        method: "put",
        body: {
            newTournamentWasAdded,
            addedTournamentWasWon,
            addedTournamentWillStart,
            addedTournamentProofSent,
            addedTournamentProofDenied,
            activityInCreatedTournament,
        },
        onError: (errors) => setMessages(errors),
        onSuccess: () => setMessages([{ message: "Settings updated successfully", type: "success" }])
    })

    return <MainLayout messages={messages}>
        <div className="settings">
            <div className="settings__body">
                <CheckInput value={newTournamentWasAdded} onChange={(val) => setNewTournamentWasAdded(val)} label="Notify via email when Someone Added a Tournament" />
                <CheckInput value={addedTournamentWasWon} onChange={(val) => setAddedTournamentWasWon(val)} label="Notify via email when Someone Wins a Tournament (Joined Only)" />
                <CheckInput value={addedTournamentWillStart} onChange={(val) => setAddedTournamentWillStart(val)} label="Notify via email before your match starts (15mins before)" />
                <CheckInput value={addedTournamentProofDenied} onChange={(val) => setAddedTournamentProofDenied(val)} label="Notify via email when Opponent raises dispute against your score" />
                <CheckInput value={activityInCreatedTournament} onChange={(val) => setActivityInCreatedTournament(val)} label="Notify via email when Someone Joins Tournament created by you." />
            </div>
            <div className="settings__button">
                <ProgressButton text="submit changes" size="large" type="secondary" onPress={async (_, next) => {
                    await doRequest();
                    next();
                }} />
            </div>
        </div>
    </MainLayout>
}

Settings.getInitialProps = async (ctx) => {
    const { data, errors } = await serverRequest(ctx, { url: "/api/ugh/user/fetch/detail", method: "get", body: {} });
    return { user: data, errors: errors || [] };
}

export default Settings;