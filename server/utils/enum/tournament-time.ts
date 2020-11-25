const msTos = 1000;
const sTom = 60;
const msTom = msTos * sTom;

export enum TournamentTime {
  TournamentCancelTime = msTom * 15,
  TournamentRankUpdateTime = msTom * 20,
  TournamentRankDisputeTime = msTom * 10,
  TournamentScoreUpdateTime = msTom * 5,
  TournamentScoreDisputeTime = msTom * 5,
  //////////////////////////////////
  //////////////////////////////////
  TournamentScoreCheckTime = msTom * 25,
}
