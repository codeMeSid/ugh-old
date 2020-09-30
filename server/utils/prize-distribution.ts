export const prizeDistribution = (coins: number, n: number) => {
  const prize = [];
  if (n === 1) prize.push(coins);
  if (n === 2) {
    const p1 = Math.floor((coins * 70) / 100);
    const p2 = coins - p1;
    prize.push(p1);
    prize.push(p2);
  }
  if (n >= 3) {
    const p1 = Math.floor((coins * 60) / 100);
    const p2 = Math.floor((coins * 30) / 100);
    const p3 = Math.floor((coins - (p1 + p2)) / (n - 2));
    prize.push(p1);
    prize.push(p2);
    for (let i = 0; i < n - 2; i++) prize.push(p3);
  }
  return prize;
};
