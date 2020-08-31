import TopNavbar from "../navbar/topnav";

import Footer from "../footer";
import SponsorSlider from "../sponsor-slider";

const MainLayout = ({ children, isFullscreen = false }: { children?: any, isFullscreen?: boolean }) => {
    return <div className="layout layout--main">
        <TopNavbar />
        <div className="layout layout__body">
            {isFullscreen ? null : <div className="layout__box" />}
            {children}
        </div>
        <SponsorSlider />
        <Footer />
    </div>
}

export default MainLayout;