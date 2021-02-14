import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineCloseCircle, AiOutlineMenu } from "react-icons/ai";
import { MdExpandMore } from "react-icons/md";

const CategoryResponsiveMenu = ({ category = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="store__nav__category__responsive">
      <div
        className="store__nav__category__responsive__title"
        onClick={() => setIsOpen(true)}
      >
        <AiOutlineMenu
          color="white"
          style={{ fontSize: 16, marginRight: 10 }}
        />
        Category
      </div>
      <div
        className={`store__nav__category__responsive__menu ${
          isOpen ? "active" : ""
        }`}
      >
        <div className="store__nav__category__responsive__menu__container__title">
          UGH Store{" "}
          <AiOutlineCloseCircle
            style={{ fontSize: 24, marginLeft: 10, color: "red" }}
            onClick={() => setIsOpen(false)}
          />
        </div>
        <div className="store__nav__category__responsive__menu__container">
          {category.map((cat) => {
            const opId = `${Math.random()}`;
            return (
              <div
                className="store__nav__category__responsive__menu__item"
                key={Math.random()}
              >
                <label
                  htmlFor={opId}
                  className="store__nav__category__responsive__menu__item__name"
                >
                  <Link href={`/store/${cat?.name}`}>
                    <a>{cat?.name}</a>
                  </Link>
                  <MdExpandMore />
                </label>
                <input
                  type="checkbox"
                  id={opId}
                  className="store__nav__category__responsive__menu__item__check"
                />
                <div className="store__nav__category__responsive__menu__item__container">
                  {Array.from(cat?.sub).map((sub) => {
                    return (
                      <Link
                        href={`/store/${cat?.name}/${sub}`}
                        key={Math.random()}
                      >
                        <a className="store__nav__category__responsive__menu__item__sub">
                          {sub}
                        </a>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryResponsiveMenu;
