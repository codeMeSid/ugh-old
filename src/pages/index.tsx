import MainLayout from "../components/layout/mainlayout";
import TournamentTab from "../components/tournament-tab";
import { TournamentDoc } from "../../server/models/tournament";
import { serverRequest } from "../hooks/server-request";
import NewsTab from "../components/news-tab";
import WallpaperSlider from "../components/wallpaper-slider";
import MessengerList from "../components/messenger";

const LandingPage = ({ matches, wallpapers, errors, currentUser }) => {

    return <MainLayout messages={errors} isFullscreen>
        <div className="landingpage" style={{ minHeight: "100vh", backgroundColor: "black" }}>
            <WallpaperSlider wallpapers={wallpapers} />
            <NewsTab />
            <TournamentTab matches={matches} />
        </div>
        {currentUser && <MessengerList
            from={currentUser.ughId}
            chats={[{ to: "admin", channel: "admin", title: "admin" }]} />}
    </MainLayout>
}

LandingPage.getInitialProps = async (ctx) => {
    const { data: tournaments, errors: errorsA }: { data: Array<TournamentDoc>, errors: Array<any> } = await serverRequest(ctx, { url: "/api/ugh/tournament/fetch/all/active", body: {}, method: "get" });
    const { data: wallpapers, errors: errorsB } = await serverRequest(ctx, { url: "/api/ugh/settings/fetch/wallpapers", body: {}, method: "get" });
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
    if (errorsB) errors.push(...errorsB)

    return {
        matches,
        wallpapers: wallpapers || [],
        errors
    };

}

export default LandingPage;