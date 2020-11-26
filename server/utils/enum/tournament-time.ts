const msTos = 1000;
const sTom = 60;
const msTom = msTos * sTom;

export enum TournamentTime {
  TournamentCancelTime = msTom * 15,
  TournamentRankUpdateTime = msTom * 30,
  TournamentRankDisputeTime = msTom * 20,
  TournamentScoreUpdateTime = msTom * 15,
  TournamentScoreDisputeTime = msTom * 10,
  //////////////////////////////////
  //////////////////////////////////
  TournamentScoreCheckTime = msTom * 15,
}
