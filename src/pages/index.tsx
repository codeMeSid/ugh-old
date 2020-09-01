import MainLayout from "../components/layout/mainlayout"

const LandingPage = ({ currentUser }) => {
    return <MainLayout isFullscreen currentUser={currentUser}>
        <div className="landingpage" style={{ minHeight: "50rem", backgroundColor: "black" }}>
        </div>
    </MainLayout>
}

export default LandingPage;