import Link from "next/link";
import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Button from "../button/main";

const UserMenu = () => {
  // TODO: add api for cart and coins
  const [cartItems, setCartItems] = useState(1);
  const [coins, setCoins] = useState(0);
  return (
    <div className="store__nav__user">
      <div className="store__nav__user__item value">
        <FaRegUserCircle />
        <div className="store__nav__user__item__info">
          <div className="store__nav__user__item__info__coins">
            <span>Shop Wallet Balance</span>
            <span>{coins} UGH COINS</span>
          </div>
          <Link href="/store/wallet">
            <a className="store__nav__user__item__info__link">
              <Button text={"Add Shop Coins"} size={"large"} />
            </a>
          </Link>
        </div>
      </div>
      <Link href="/store/cart">
        <a className="store__nav__user__item">
          <RiShoppingCartLine />
          {cartItems >= 1 && (
            <div className="store__nav__user__item__cart">{cartItems}</div>
          )}
        </a>
      </Link>
    </div>
  );
};

export default UserMenu;
