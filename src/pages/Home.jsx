import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Chat from "../components/Chat.jsx";
const Home = () => {
  return (
    <div className="home">
      <div className="container">
        <Sidebar/>
        <Chat />
      </div>
    </div>
  );
};
export default Home;
