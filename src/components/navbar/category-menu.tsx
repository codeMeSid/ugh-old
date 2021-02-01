import React, { useEffect, useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { useRequest } from "../../hooks/use-request";

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
            <div className="store__nav__category__item__name">
              {cat?.name}
              <MdExpandMore />
            </div>
            <div className="store__nav__category__item__sub"></div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryMenu;
