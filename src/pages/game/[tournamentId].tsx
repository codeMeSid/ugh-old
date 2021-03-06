import React, { useEffect, useState } from "react";
import { BracketDoc } from "../../../server/models/bracket";
import BracketRankCard from "../../components/card/bracket-rank";
import BracketScoreCard from "../../components/card/bracket-score";
import MainLayout from "../../components/layout/mainlayout";
import MessengerList from "../../components/messenger";
import { serverRequest } from "../../hooks/server-request";
import { useRequest } from "../../hooks/use-request";
import { event } from "../../socket";

const Logo = require("../../public/asset/logo_icon.webp");

const BracketList = ({
  brackets,
  errors,
  userHasUploadedScore,
  currentUser,
  tournamentId,
  chats,
}: {
  brackets: Array<BracketDoc>;
  errors: any;
  userHasUploadedScore: boolean;
  currentUser: any;
  tournamentId: string;
  chats: Array<any>;
}) => {
  const [matches, setMatches] = useState(brackets);
  const [uploadedScore, setUploadedScore] = useState(userHasUploadedScore);
  const [messages, setMessages] = useState(errors);

  const { doRequest } = useRequest({
    url: `/api/ugh/bracket/fetch/${tournamentId}`,
    body: {},
    method: "get",
    onSuccess: (data) => {
      setMatches(data?.brackets || []);
      setUploadedScore(!!data?.playerHasUploadedScore);
    },
    onError: (data) => setMessages(data),
  });
  useEffect(() => {
    event.recieveMessage(async (data) => {
      const { by, on, type, tournamentId: eTId } = data;
      const { ughId } = currentUser;
      if (!tournamentId) return;
      if (eTId !== tournamentId) return;
      await doRequest();
      const messagesUpdate = [...messages];
      const mBy = by === ughId ? "you" : by;
      switch (type) {
        case "score":
          messagesUpdate.push({
            message: `${mBy} updated ${brackets[0]?.gameType}`,
            type: "success",
          });
          break;
        case "dispute":
          messagesUpdate.push({
            message: `${mBy} raised dispute`,
            type: "success",
          });
          break;
        case "proof":
          messagesUpdate.push({
            message: `${mBy} uploaded proof`,
            type: "success",
          });
          break;
        case "accept":
          messagesUpdate.push({
            message: `${mBy} accepted proof and lost dispute`,
            type: "success",
          });
          break;
        case "over":
          messagesUpdate.push({ message: `tournament over`, type: "success" });
          break;
        case "update":
          messagesUpdate.push({
            message: `tournament updates`,
            type: "success",
          });
          break;
      }
      setMessages(messagesUpdate);
    });
  }, []);

  return (
    <MainLayout messages={messages}>
      <div className="bracket__title">brackets</div>
      <div className="bracket__list">
        {matches?.map((bracket) => {
          if (bracket.gameType === "score")
            return (
              <BracketScoreCard
                bracket={bracket}
                tournamentId={tournamentId}
                onError={(errors: any) => setMessages(errors)}
                currentUser={currentUser}
                key={Math.random()}
              />
            );
          else
            return (
              <BracketRankCard
                bracket={bracket}
                tournamentId={tournamentId}
                onError={(errors: any) => setMessages(errors)}
                userHasUploadedScore={uploadedScore}
                currentUser={currentUser}
                key={Math.random()}
              />
            );
        })}
      </div>
      <MessengerList
        from={currentUser?.ughId}
        currentUser={currentUser}
        chats={[
          { channel: "admin", title: "admin", to: "admin", profile: Logo },
          { channel: "match", title: "match chat", to: tournamentId },
          ...chats
            .map((user: any) => {
              if (currentUser?.ughId === user?.ughId) return;
              return {
                to: user?.ughId,
                channel: "user",
                profile: user?.uploadUrl,
                title: user?.ughId,
              };
            })
            .filter((chat: any) => chat && chat.to !== currentUser?.ughId),
        ]}
      />
    </MainLayout>
  );
};

BracketList.getInitialProps = async (ctx) => {
  const { tournamentId } = ctx.query;
  if (tournamentId) {
    const { data, errors } = await serverRequest(ctx, {
      url: `/api/ugh/bracket/fetch/${tournamentId}`,
      body: {},
      method: "get",
    });
    return {
      brackets: data?.brackets || [],
      chats: data?.players || [],
      userHasUploadedScore: !!data?.playerHasUploadedScore,
      errors: errors || [],
      tournamentId,
    };
  }
  return { errors: [{ message: "Something went wrong, Save yourself!!!" }] };
};

export default BracketList;
