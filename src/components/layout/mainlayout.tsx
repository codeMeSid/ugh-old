import TopNavbar from "../navbar/topnav";

import Footer from "../footer";
import SponsorSlider from "../sponsor-slider";

const MainLayout = ({ children, isFullscreen = false, currentUser }: { children?: any, isFullscreen?: boolean, currentUser?: any }) => {
    return <div className="layout layout--main">
        <TopNavbar currentUser={currentUser} />
        <div className="layout layout__body">
            {isFullscreen ? null : <div className="layout__box" />}
            {children}
        </div>
        <SponsorSlider />
        <Footer />
    </div>
}

export default MainLayout;