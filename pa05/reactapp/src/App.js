import React,{useState} from "react";
import "./styles.css";
import Transactions,{testing} from './Transactions'

function About(){
  return(
    <h3>My name is Eliora Kruman, and I'm a CS major at Brandeis. This is a simple app to record transactions. Input a description, amount, and category to see your transaction added to the list. You can edit/delete/sort transactions later. Enjoy! ^-^</h3>
  )
}

export default function App() {
  let [page,setPage]=useState('Transactions')

  let theApp
  if (page=='Transactions') {
    theApp= <Transactions />
  } else if (page=="About") {
    theApp = <About />
  }

  return (
    <div className="App container">
      <h1>Welcome to my transactions app!</h1>
      <button onClick={() => setPage("Transactions")}>Transactions</button>
      <button onClick={() => setPage("About")}>About</button>
      {theApp}
    </div>

  );
}