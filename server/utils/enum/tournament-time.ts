const msTos = 1000;
const sTom = 60;
const msTom = msTos * sTom;

export enum TournamentTime {
  TournamentCancelTime = msTom * 15,
  TournamentRankUpdateTime = msTom * 5,
  TournamentRankDisputeTime = msTom * 5,
  TournamentScoreUpdateTime = msTom * 5,
  TournamentScoreDisputeTime = msTom * 5,
}
