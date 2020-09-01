import { CoinDoc } from "../../../server/models/coin";
import Link from "next/link";
import ProgressButton from "../button/progress";
import Button from "../button/main";

const Coin = require("../../public/asset/coins.png");

const ShopCard = ({ coin, currentUser }: { coin: CoinDoc, currentUser: any }) =>
    <div className="shop__card">
        <div className="shop__card__value">{coin.value} COINS</div>
        <img src={Coin} alt="ugh coins" className="shop__card__coin" />
        <div className="shop__card__cost">&#8377; {coin.cost}</div>
        {
            currentUser
                ? <ProgressButton text="BUY" type="link" size="small" />
                : <Link href="/signin">
                    <a>
                        <Button type="link" size="small" text="BUY" />
                    </a>
                </Link>
        }
    </div>

export default ShopCard;