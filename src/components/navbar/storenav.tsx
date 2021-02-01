import CategoryMenu from "./category-menu";
import UserMenu from "./user-menu";

const StoreNav = ({ currentUser }: { currentUser?: any }) => {
  return (
    <div className="store__nav">
      <CategoryMenu />
      <UserMenu />
    </div>
  );
};

export default StoreNav;
