import { serverRequest } from "../../../hooks/server-request";
import { GameDoc } from "../../../../server/models/game";
import SideLayout from "../../../components/layout/sidelayout";
import Input from "../../../components/input/input";
import RichText from "../../../components/rich-text";

const GameDetail = ({
  game,
  errors,
  currentUser,
}: {
  game: GameDoc;
  errors: any;
  currentUser?: any;
}) => {
  return (
    <SideLayout
      currentUser={currentUser}
      messages={errors}
      title={game?.name?.substr(0, 5)}
    >
      <div className="detail">
        <div className="row">
          <div className="col">
            <Input placeholder="name" value={game?.name} disabled />
          </div>
          <div className="col">
            <Input placeholder="console" value={game?.console} disabled />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <a href={game?.imageUrl} target="_blank">
              <img
                src={game?.imageUrl}
                alt={game?.name}
                className="detail__image"
              />
            </a>
          </div>
          <div className="col">
            <a href={game?.thumbnailUrl} target="_blank">
              <img
                src={game?.thumbnailUrl}
                alt={game?.name}
                className="detail__image"
              />
            </a>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Input
              placeholder="minimum player %"
              value={game?.cutoff || 50}
              disabled
            />
          </div>
          <div className="col">
            <Input
              placeholder="game evaluation type"
              value={game?.gameType || "score"}
              disabled
            />
          </div>
        </div>
        <h2>Participants</h2>
        <div className="row">
          {game?.participants?.map((p) => (
            <div key={p} className="pill">
              {p}
            </div>
          ))}
        </div>
        <h2>groups</h2>
        <div className="row">
          {game?.groups?.map((g) => (
            <div key={g.name} className="pill">
              {g.name}-{g.participants}
            </div>
          ))}
        </div>
        <h2>winners</h2>
        <div className="row">
          {game?.winners?.map((w) => (
            <div key={w} className="pill">
              {w}
            </div>
          ))}
        </div>
        <h2>rules</h2>
        <div style={{ maxWidth: "60rem", width: "100%", margin: "0 auto" }}>
          <RichText content={game?.rules} />
        </div>
      </div>
    </SideLayout>
  );
};

GameDetail.getInitialProps = async (ctx) => {
  const { gameId } = ctx.query;
  const { data, errors } = await serverRequest(ctx, {
    url: `/api/ugh/game/fetch/detail/${gameId}`,
    body: {},
    method: "get",
  });
  return { game: data, errors: errors || [] };
};

export default GameDetail;
