import { useState, useEffect } from "react";

const WallpaperSlider = ({ wallpapers }: { wallpapers: Array<string> }) => {
    const [progress, setProgress] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            if (progress === 100) {
                if (wallpapers.length > 0 && activeIndex >= 0 && activeIndex < wallpapers.length - 1) setActiveIndex(activeIndex + 1);
                else setActiveIndex(0);
                setProgress(0);
            }
            else setProgress(progress + 1);
        }, 50)
    }, [progress])

    return <div className="wallpaper">
        <div className="wallpaper__container">
            {
                wallpapers.map((paper, index) => {
                    return index === activeIndex
                        ? <div key={paper} style={{backgroundImage:`url(${paper})`}} className="wallpaper__item" />
                        : null
                })
            }
        </div>
        <div className="wallpaper__progress" style={{ width: `${progress}%` }} />
        <div className="wallpaper__dock">
            {
                wallpapers.map((paper, index) => {
                    return <img onClick={() => setActiveIndex(index)} key={paper} src={paper} alt={`ugh-${index + 1}`} className={`wallpaper__dock__item ${index === activeIndex ? "active" : ""}`} />
                })
            }
        </div>
    </div>
}

export default WallpaperSlider;