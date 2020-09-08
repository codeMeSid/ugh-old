import MainLayout from "../components/layout/mainlayout"
import TournamentTab from "../components/tournament-tab"
import { TournamentDoc } from "../../server/models/tournament"
import { serverRequest } from "../hooks/server-request"
import NewsTab from "../components/news-tab"

const LandingPage = ({ matches }) => {
    return <MainLayout isFullscreen>
        <div className="landingpage" style={{ minHeight: "100vh", backgroundColor: "black" }}>
            <div style={{ height: 500 }}></div>
            <NewsTab />
            <TournamentTab matches={matches} />
        </div>
    </MainLayout>
}

LandingPage.getInitialProps = async (ctx) => {
    const { data, errors }: { data: Array<TournamentDoc>, errors: Array<any> } = await serverRequest(ctx, { url: "/api/ugh/tournament/fetch/all/active", body: {}, method: "get" });
    const matches = {
        upcoming: [],
        started: [],
        completed: []
    }
    if (!data) {
        return {
            matches, errors
        }
    }

    data.forEach(tournament => {
        matches[tournament.status] = [...matches[tournament.status], tournament];
    })

    return { matches, errors };

}

export default LandingPage;