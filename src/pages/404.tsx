import MainLayout from "../components/layout/mainlayout"

const IMG404 = require("../public/asset/404.gif")

export default () => <MainLayout>
    <div style={{ backgroundImage: `url(${IMG404})` }} className="wallpaper--404">

    </div>
</MainLayout>
