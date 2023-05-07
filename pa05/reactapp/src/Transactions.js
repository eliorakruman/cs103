
import React,{useState,useEffect} from "react";
import "./styles.css";



const initTransactionss = [
  { key: 0, desc: "insurance", amount: '200', category: 'car', date: '11/12/2021' },
  { key: 1, desc: "dog food", amount: '100', category: 'pet', date: '11/12/2023' }
];

function getItemsFromLocalStorage() {
  // getting stored value
  const saved = localStorage.getItem("items");
  const initialValue = JSON.parse(saved)||[];
  // relabel the keys from 0 to length-1
  for(let i=0;i<initialValue.length;i++){
    initialValue[i]['key']=i
  }
  return initialValue || [];
}


export default function App() {

  let [items, setItems] = useState(getItemsFromLocalStorage);
  let [numKeys,setNumKeys] = useState(() => items.length)
  let [msg,setMsg] = useState('none');

  function add_item() {
    // add an item to the todolist
    const item = document.getElementById("item").value;
    const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
    let newItem = {
      key: numKeys,
      desc: item,
      amount: amount,
      category: category,
      date: new Date().toLocaleDateString(),
    };
    document.getElementById("item").value = ""
    document.getElementById("amount").value = ""
    document.getElementById("category").value = ""
    setNumKeys(numKeys+1)
    setItems([newItem,...items]); // using the spread operator ...
  }

  function deleteItem(key){
    console.log(key)
    const newItems = items.filter((x)=> x['key']!== key)
    setItems(newItems)
    setNumKeys(numKeys-1)
  }

  



  useEffect(() => {
    // storing items if items changes value
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  // // demo of how to get data from an Express server
  // useEffect(() => {
  //   const getMsg = async () => {
  //     const response = await fetch('http://localhost:3000/test');
  //     const result = await response.json();
  //     setMsg(result);
  //     console.log('msg =',result);
  //   }
  //   getMsg()
  // },[msg])

  // this is used to allow text data to be submitted
  // when the user hits the 'Enter' key
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // 👇 Get input value
      add_item();
    }
  };

  function edit(item){
    // edit an item in the transaction list
    const newDesc = prompt("Enter new description",item.desc);
    const newAmount = prompt("Enter new amount",item.amount);
    const newCategory = prompt("Enter new category",item.category);
    const newDate = prompt("Enter new date",item.date);
    item.desc = newDesc;
    item.amount = newAmount;
    item.category = newCategory;
    item.date = newDate;
    setItems([...items]);  // force redraw of screen
}

function sortBy(key){
    const sortedItems = [...items];
    switch(key){
        case "date":
            sortedItems.sort((a,b)=>(a.date>b.date)?1:-1);
            break;
        case "month":
            sortedItems.sort((a,b)=>(a.date.split('/')[0]>b.date.split('/')[0])?-1:1);
            break;
        case "year":
            sortedItems.sort((a,b)=>(a.date.split('/')[2]>b.date.split('/')[2])?1:-1);
            break;
        case "category":
            sortedItems.sort((a,b)=>(a.category>b.category)?1:-1);
            break;
        case "amount":
            sortedItems.sort((a,b)=>(a.amount>b.amount)?1:-1);
            break;
    }
    setItems(sortedItems);
}


  return (
    <div className="App">
        <br></br>
      <h1>Transactions List</h1>
      <table>
        <tbody>
            <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
            </tr>
            {items.map((item) => (
            <tr>       
              <td>{item["desc"]}</td>
              <td>{item["amount"]}</td>
              <td>{item["category"]}</td>
              <td>{item["date"]}</td>
              <td><button onClick={()=>deleteItem(item["key"])}>X</button></td>
              <td><button onClick={()=>edit(item)}>EDIT</button></td>
            </tr>
            ))}
        </tbody>
      </table>

        <br />    

      <h2> Add new transaction! </h2>
      <input type="text" 
             onKeyDown={handleKeyDown}
             id="item" placeholder="Description" />
             <br />
      <input type="text" id="amount" placeholder="Amount" />
             <br />
       <input type="text" id="category" placeholder="Category" />
             <br />
      <button onClick={() => add_item()}>add transaction</button>
      <br />
      <br />
      <button onClick={() => sortBy("date")}>Sort by Date</button>
<button onClick={() => sortBy("month")}>Sort by Month</button>
<button onClick={() => sortBy("year")}>Sort by Year</button>
<button onClick={() => sortBy("category")}>Sort by Category</button>
<button onClick={() => sortBy("amount")}>Sort by Amount</button>
    </div>

  );
}
