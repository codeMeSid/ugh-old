import MainLayout from "../components/layout/mainlayout";
import TournamentTab from "../components/tournament-tab";
import { TournamentDoc } from "../../server/models/tournament";
import { serverRequest } from "../hooks/server-request";
import NewsTab from "../components/news-tab";
import WallpaperSlider from "../components/wallpaper-slider";
import MessengerList from "../components/messenger";

const Logo = require("../public/asset/logo-icon.png");

const LandingPage = ({ matches, errors, currentUser }) => {

    return <MainLayout messages={errors} isFullscreen>
        <div className="landingpage" style={{ minHeight: "100vh", backgroundColor: "black" }}>
            <WallpaperSlider/>
            <NewsTab />
            <TournamentTab matches={matches} />
        </div>
        {currentUser && <MessengerList
            from={currentUser.ughId}
            currentUser={currentUser}
            chats={[{ to: "admin", channel: "admin", title: "admin", profile: Logo },]} />}
    </MainLayout>
}

LandingPage.getInitialProps = async (ctx) => {
    const { data: tournaments, errors: errorsA }: { data: Array<TournamentDoc>, errors: Array<any> } = await serverRequest(ctx, { url: "/api/ugh/tournament/fetch/all/active", body: {}, method: "get" });
    const matches = {
        upcoming: [],
        started: [],
        completed: []
    }
    if (tournaments) tournaments.forEach(tournament => {
        matches[tournament.status] = [...matches[tournament.status], tournament];
    });

    const errors = [];
    if (errorsA) errors.push(...errorsA);

    return {
        matches,
        errors
    };

}

export default LandingPage;