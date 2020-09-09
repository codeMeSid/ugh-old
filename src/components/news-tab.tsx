import { useState, useEffect } from "react";
import { NewsDoc } from "../../server/models/news";
import { useRequest } from "../hooks/use-request";

const NewsTab = () => {
    const [news, setNews] = useState([]);
    const { doRequest } = useRequest({
        url: "/api/ugh/news/fetch/active",
        method: "get",
        body: {},
        onSuccess: (data) => setNews(data)
    });
    useEffect(() => {
        doRequest();
    }, [])
    return <div className="news">
        <div className="news__title">
            news & advertisments
        </div>
        <div className="news__list">
            {news.map((newsItem: NewsDoc) => {
                return <div key={Math.random()} className="news__item">
                    <div className="news__item__title">{newsItem.title}</div>
                    <div className="news__item__desc">{newsItem.description}</div>
                </div>
            })}
        </div>
    </div>
}

export default NewsTab;