import { useState, useEffect } from "react";
import { NewsDoc } from "../../server/models/news";
import { useRequest } from "../hooks/use-request";
import Link from 'next/link';

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
            news & advertisements
        </div>
        <div className="news__list">
            {news.map((newsItem: NewsDoc) => {
                return <Link key={newsItem.id} href={`/news/${newsItem.id}`}>
                    <a style={{ backgroundImage: `url(${newsItem?.uploadUrl})` }} className="news__item">
                        <div className="news__item__title">{newsItem.title}</div>
                    </a>
                </Link>
            })}
        </div>
    </div>
}

export default NewsTab;