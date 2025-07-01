import React from 'react'
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const clickevent = () => {
    navigate("/searchforproduct");
  };
  const clickevent1 = () => {
    navigate("/sell");
  };
  const clickevent2 = () => {
    navigate("/displayproduct");
  };
  

  return (
    <div>
      <button onClick={clickevent}>
        SearchProduct
      </button>
      <button onClick={clickevent1}>
        SellProduct
      </button>
      <button onClick={clickevent2}>
        SearchForProduct
      </button>
    </div>
  );
}

export default Home;
