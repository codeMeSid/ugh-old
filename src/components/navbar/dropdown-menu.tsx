import Link from "next/link";

const DropdownMenu = ({
  title,
  listItems,
}: {
  title: string;
  listItems: Array<string>;
}) => {
  return (
    <div className="navbar__item--dropdown">
      <div className="navbar__item--dropdown__title">{title}</div>
      <div className="navbar__item--dropdown__menu">
        {listItems.map((link) => {
          const splitText = link.split("-");
          const show = splitText.join(" ");
          return (
            <Link key={Math.random()} href={`/${link}`}>
              <a className="navbar__item--dropdown__menu__item">{show}</a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DropdownMenu;
