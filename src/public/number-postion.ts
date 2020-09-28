export const numberPostion = (val: number) => {
    const j = val % 10;
    const k = val % 100;
    if (j == 1 && k != 11) {
      return val + "st";
    }
    if (j == 2 && k != 12) {
      return val + "nd";
    }
    if (j == 3 && k != 13) {
      return val + "rd";
    }
    return val + "th";
  };
  