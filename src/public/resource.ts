export const profileMenuLinks = [
  "profile",
  "my-tournament",
  "withdraw",
  "settings",
  "logout",
];
export const moreMenuLinks = [
  "gallery",
  "streams",
  "sponsors",
  "how-to-play",
  "about",
];
export const navlinks = (currentUser): Array<string> => [
  "tournaments",
  "shop",
  ...(currentUser ? [] : ["signin", "signup"]),
];
export const outerMenuLinks = (currentUser): Array<string> => [
  "shop",
  "tournaments",
  "streams",
  ...(currentUser
    ? ["profile", "withdraw", "my-tournament", "signout"]
    : ["sponsors", "about", "how-to-play", "signin", "signup"]),
];
