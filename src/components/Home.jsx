// pages/admin/Home.jsx
import Sidebar from "./Sidebar";
import UserCard from "./UserCard";

const Home = ({ open, setOpen }) => {
  return (
    <>
      <Sidebar open={open} setOpen={setOpen} />
      <div className="app-main">
        <UserCard />
      </div>
    </>
  );
};

export default Home;
