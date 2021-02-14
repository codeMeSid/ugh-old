import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { useRequest } from "../../hooks/use-request";
import CategoryResponsiveMenu from "./category-responsive-menu";

const CategoryMenu = () => {
  const [category, setCategory] = useState([]);
  const { doRequest } = useRequest({
    url: "/api/ugh/category/fetch/active",
    body: {},
    method: "get",
    onSuccess: (data) => {
      setCategory(data);
    },
  });
  useEffect(() => {
    doRequest();
  }, []);
  return (
    <div className="store__nav__category">
      {category.map((cat) => {
        return (
          <div className="store__nav__category__item" key={Math.random()}>
            <Link href={`/store/${cat?.name}`}>
              <a className="store__nav__category__item__name">
                {cat?.name}
                <MdExpandMore />
              </a>
            </Link>
            <div className="store__nav__category__item__sub">
              {Array.from(cat.sub).map((sub) => {
                return (
                  <Link href={`/store/${cat?.name}/${sub}`} key={Math.random()}>
                    <a className="store__nav__category__item__sub__item">
                      {sub}
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
      <CategoryResponsiveMenu category={category} />
    </div>
  );
};

export default CategoryMenu;
