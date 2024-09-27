import { useState, useEffect } from "react";
import Navbar from "../component/Navbar/navbar";
import Routers from "./routers";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div>
        <Routers />
      </div>
    </>
  );
};

export default Layout;
