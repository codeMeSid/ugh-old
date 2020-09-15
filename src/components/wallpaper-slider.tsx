import { useState, useEffect } from "react";
import Button from "./button/main";

const WallpaperSlider = ({ wallpapers }: { wallpapers: Array<any> }) => {
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
                        ? <div key={paper} style={{ backgroundImage: `url(${paper.uploadUrl})` }} className="wallpaper__item" >
                            <div className="wallpaper__item__title">
                                {paper.title && <div className="wallpaper__item__title__text">{paper.title}</div>}
                                {paper.href && <a href={paper.href} className="wallpaper__item__href">
                                    <Button text="CLICK HERE" />
                                </a>}
                            </div>
                        </div>
                        : null
                })
            }
        </div>
        <div className="wallpaper__progress" style={{ width: `${progress}%` }} />
        <div className="wallpaper__dock">
            {
                wallpapers.map((paper, index) => {
                    return <img onClick={() => setActiveIndex(index)} key={paper.uploadUrl} src={paper.uploadUrl} alt={`ugh-${index + 1}`} className={`wallpaper__dock__item ${index === activeIndex ? "active" : ""}`} />
                })
            }
        </div>
    </div>
}

export default WallpaperSlider;