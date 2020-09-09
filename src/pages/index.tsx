import MainLayout from "../components/layout/mainlayout"
import TournamentTab from "../components/tournament-tab"
import { TournamentDoc } from "../../server/models/tournament"
import { serverRequest } from "../hooks/server-request"
import NewsTab from "../components/news-tab"
import WallpaperSlider from "../components/wallpaper-slider"

const LandingPage = ({ matches, wallpapers }) => {
    console.log({ wallpapers })
    return <MainLayout isFullscreen>
        <div className="landingpage" style={{ minHeight: "100vh", backgroundColor: "black" }}>
            <WallpaperSlider wallpapers={wallpapers} />
            <NewsTab />
            <TournamentTab matches={matches} />
        </div>
    </MainLayout>
}

LandingPage.getInitialProps = async (ctx) => {
    const { data, errors }: { data: Array<TournamentDoc>, errors: Array<any> } = await serverRequest(ctx, { url: "/api/ugh/tournament/fetch/all/active", body: {}, method: "get" });
    const { data: wallpapers } = await serverRequest(ctx, { url: "/api/ugh/settings/fetch/wallpaper", body: {}, method: "get" });
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

    return {
        matches,
        wallpapers: wallpapers || [],
        errors
    };

}

export default LandingPage;