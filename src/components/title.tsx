const Title = ({ route, query = { ughId: "Player" } }) => {
  const getTitle = {
    "/": "Home",
    "/about": "About",
    "/add-tournament": "Add New Tournament",
    "/gallery": "Gallery",
    "/how-to-play": "How To Play",
    "/my-tournament": "My Tournament",
    "/privacy": "Privacy Policy",
    "/settings": "Profile Settings",
    "/shop": "Coins Shop",
    "/signout": "See You Soon",
    "/signup": "Registration",
    "/streams": "Gaming & Live Streams",
    "/tac": "Terms & Conditions",
    "/withdraw": "Withdraw Coins",
    "/account/activate/[ughId]": "Account Activated",
    "/account/activate": "Account Activation Mail Sent",
    "/account/forgot-password": "Forgot Password",
    "/account/reset-password/[recoveryToken]": "Reset Password",
    "/game/[tournamentId]": "Tournament Brackets",
    "/news/[newsId]": "News Story",
    "/profile/[ughId]": `${query.ughId}\'s Profile`,
    "/profile/edit": "Edit Profile",
    "/profile": "My Profile",
    "/sponsors": "UGH Sponsors",
    "/sponsors/[sponsorId]": "Sponsors Confirmation Form",
    "/tournaments/[tournamentId]": "Tournament Detail",
    "/tournaments": "UGH Tournaments",
  };
  return (
    <title>{`${getTitle[route]} - Ultimate Gamers Hub | Play Tournaments`}</title>
  );
};

export default Title;
