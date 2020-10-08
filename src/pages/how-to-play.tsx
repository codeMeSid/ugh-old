import MainLayout from "../components/layout/mainlayout";
import RichText from "../components/rich-text";
import { serverRequest } from "../hooks/server-request";

const HowToPlayPage = ({ howToPlay, errors }) => (
    <MainLayout messages={errors}>
        <div className="about">
            <div className="about__title">
                how to play
            </div>
            <div>
                <RichText className="about__content" content={howToPlay} />
            </div>
        </div>
    </MainLayout>
)

HowToPlayPage.getInitialProps = async (ctx) => {
    const { data: howToPlay, errors } = await serverRequest(ctx, { url: "/api/ugh/settings/fetch/howToPlay", body: {}, method: "get" });
    return {
        howToPlay,
        errors: errors || []
    };
}

export default HowToPlayPage