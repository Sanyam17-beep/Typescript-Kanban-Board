import React, { useEffect, useState } from "react";
import { LogOut } from "react-feather";
import Board from "../Components/Board/Board";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Transition from "../transition/Transition";
import { DragDropContext, Droppable, DropResult, DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";
import styled from "styled-components";
import Card from "../Components/Card/Card";
import Dropdown from "../Components/Dropdown/Dropdown";
const dummyCard = {
  id: -1,
  title: "Sample Card",
  labels: [],
  date: "",
  desc: "",
  tasks: [],
  index: -1,
};
const TaskList = styled.div<{ isDraggingOver: boolean }>`
  background-color: #f4f5f7;
`;
interface TaskList {
  isDraggingOver: boolean;
}
interface Label {
  color: string;
  text: string;
}



interface BoardType {
  id: number;
  _id:number;
  title: string;
  cards: Card[];
}

function Home() {
  const navigate = useNavigate();
  const navigateHandler = (path: string) => {
    navigate(path);
  };

  const signOut = async()=>{
    const datatobeSend = localStorage.getItem("prac-kanban");
    const userid = localStorage.getItem("userid");

    await fetch(`https://test-back-jeji.onrender.com/update/${userid}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:datatobeSend
    });

    localStorage.clear();
    navigate("/signin");

  }
  const savedBoardsJSON = localStorage.getItem("prac-kanban");
  const savedBoards = savedBoardsJSON ? JSON.parse(savedBoardsJSON) : null;

  const defaultBoards = [
    {
      id: 1,
      title: "To-do",
      cards: [],
    },
    {
      id: 2,
      title: "In-Progress",
      cards: [],
    },
    {
      id: 3,
      title: "Done",
      cards: [],
    },
  ];

  const initialBoards = savedBoards || defaultBoards;

  const [boards, setBoards] = useState<BoardType[]>(initialBoards);
  const [Type, setType] = useState<string>("password");
  const [name, setname] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [pass,setPass] = useState("");
  const updateUser = async(event:any)=>{
    event.preventDefault();
    const uid = localStorage.getItem("userid");
    await fetch(`https://test-back-jeji.onrender.com/updateUser/${uid}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({username:name,email:email,password:pass})
    }).then((res)=>{
      alert("updated successfully");
    }).catch((err)=>
      alert("Server error")
    )
  }
  const [targetCard, setTargetCard] = useState<{
    bid: string;
    cid: string;
  }>({
    bid: "",
    cid: "",
  });



  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || !source || source.droppableId === destination.droppableId) {
      return;
    }

    const s_boardIndex = boards.findIndex((item) => String(item._id) === source.droppableId);
    if (s_boardIndex < 0) return;

    const s_cardIndex = boards[s_boardIndex]?.cards.findIndex(
      (item) => String(item.id) === draggableId
    );
    if (s_cardIndex < 0) return;

    const t_boardIndex = boards.findIndex((item) => String(item._id) === destination.droppableId);
    if (t_boardIndex < 0) return;

    const t_cardIndex = destination.index;
    if (t_cardIndex < 0) return;

    const tempBoards = [...boards];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);

    setBoards(tempBoards);
  };

  const addCardHandler = (id: number, title: string) => {
    
    
    const index = boards.findIndex((item) => item._id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards[index].cards.push({
      id: Date.now() + Math.random() * 2,
      title,
      labels: [],
      date: "",
      desc: "",
      tasks: [],
      index
    });

    
    setBoards(tempBoards);
   
  };

  const removeCard = (bid: number, cid: number) => {
    const index = boards.findIndex((item) => item._id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);
    setBoards(tempBoards);
  };

  const dragEnded = (bid: string, cid: string) => {
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    s_boardIndex = boards.findIndex((item) => String(item._id) === bid);
    if (s_boardIndex < 0) return;

    s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
      (item) => String(item.id) === cid
    );
    if (s_cardIndex < 0) return;

    t_boardIndex = boards.findIndex((item) => String(item._id) === targetCard.bid);
    if (t_boardIndex < 0) return;

    t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
      (item) => String(item.id) === targetCard.cid
    );
    if (t_cardIndex < 0) return;

    const tempBoards = [...boards];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);

    setBoards(tempBoards);

    setTargetCard({
      bid: "",
      cid: "",
    });
  };

  const dragEntered = (bid: string, cid: string) => {
    if (targetCard.cid === cid) return;
    setTargetCard({
      bid,
      cid,
    });
  };

  const updateCard = (bid: number, cid: number, card: Card) => {
    const index = boards.findIndex((item) => item._id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;

    setBoards(tempBoards);
  };
  const fetchData = async () => {
    const userId = localStorage.getItem("userid");
    if((userId) == null){
        navigate('/signin');
        return
    }
    const data = await fetch(`https://test-back-jeji.onrender.com/getData/${userId}`, {
      method: "GET",
    });
    if (data.status == 201) {
      const res = await data.json();
      localStorage.setItem("prac-kanban", JSON.stringify(res));
      const savedBoardsJSON = localStorage.getItem("prac-kanban");
      if (savedBoardsJSON) {
        const savedBoards: BoardType[] = JSON.parse(savedBoardsJSON);
        setBoards(savedBoards);
      }
    }else if(data.status==401){
      navigate('/signin');
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("prac-kanban",JSON.stringify(boards));
  
  }, [boards]);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <div className="app_nav">
        <h1 onClick={() => navigateHandler('/home')}>KANBAN</h1>
        <div className="Nav-Icons">
        <div
                onClick={(event) => {
                  event.stopPropagation();
                  setShowDropdown(true);
                }}
              >
          <img
            src='avataaars.png'
            alt="A"
            className="ProfileIcons"
          />
          {showDropdown && (
                  <Dropdown                     //Dropdown Delete Card Component
                    class="board_dropdown"
                    onClose={() => setShowDropdown(false)}
                  >
                   <div className="Update-Form">
          <label htmlFor="inputName" className="labelName">
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => {
                setname(e.target.value);
              }}
              className="Form-input"
            />
          </label>
          <label htmlFor="inputEmail" className="labelEmail">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
              className="Form-input"
            />
          </label>
          <label htmlFor="inputPassword" className="labelPassword">
            <input
              type={Type}
              placeholder="New Password"
              value={pass}
              onChange={(e)=>setPass(e.target.value)}
              className="Form-input"
            />{" "}
            <br />
            <div className="Show-Password">
              <input
                type="checkbox"
                id="checkbox"
              
                onClick={() => {
                  if (Type === "password") setType("text");
                  else setType("password");
                }}
              />{" "}
              <span style={{ color: "white" }} >Show Password</span>
            </div>
          </label>
          <label htmlFor="Submit" className="labelSubmit">
            <input type="submit" value="Update" style={{cursor:"pointer"}} onClick={(event)=>updateUser(event)} className="Submit" />
          </label>
        </div>
                  </Dropdown>
                )}
          </div>
          <LogOut height={30} width={30} onClick={() =>signOut()} />
        </div>
      </div>
      <Transition>  {/*Transition for Fade in effect on page change */}
        <DragDropContext onDragEnd={(result: DropResult) => handleDragEnd(result)}>
          <div style={{ height: "85vh" }}>
            <div className="Note">Click on card to edit or add labels, due date, description and tasks</div>
            <div className="app_boards_container">
              <div className="app_boards">
                <Droppable droppableId={boards[0]._id + ""}>
                  {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                    <TaskList ref={provided.innerRef}
                      {...provided.droppableProps}
                      isDraggingOver={snapshot.isDraggingOver} style={{
                        backgroundColor: "rgb(149 131 131 / 10%)",
                        borderRadius: "0.5rem",
                        border: "solid 1px #ffffff2b"
                      }}>
                      <Board
                        key={boards[0]._id}
                        board={boards[0]}
                        card={dummyCard}
                        addCard={addCardHandler}
                        removeCard={removeCard}
                        dragEnded={dragEnded}
                        dragEntered={dragEntered}
                        updateCard={updateCard}
                      />
                      {provided.placeholder}
                    </TaskList>
                  )}
                </Droppable>
                <Droppable droppableId={boards[1]._id + ""}>
                  {(provided, snapshot) => (
                    <TaskList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      isDraggingOver={snapshot.isDraggingOver}
                      style={{
                        backgroundColor: "rgb(149 131 131 / 10%)",
                        borderRadius: "0.5rem",
                        border: "solid 1px #ffffff2b"
                      }}
                    >
                      <Board
                        key={boards[1]._id}
                        board={boards[1]}
                        card={dummyCard}
                        addCard={addCardHandler}
                        removeCard={removeCard}
                        dragEnded={dragEnded}
                        dragEntered={dragEntered}
                        updateCard={updateCard}

                      />
                      {provided.placeholder}
                    </TaskList>
                  )}
                </Droppable>
                <Droppable droppableId={boards[2]._id + ""}>
                  {(provided, snapshot) => (
                    <TaskList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      isDraggingOver={snapshot.isDraggingOver}
                      style={{
                        backgroundColor: "rgb(149 131 131 / 10%)",
                        borderRadius: "0.5rem",
                        border: "solid 1px #ffffff2b"
                      }}
                    >
                      <Board
                        key={boards[2]._id}
                        board={boards[2]}
                        card={dummyCard}
                        addCard={addCardHandler}
                        removeCard={removeCard}
                        dragEnded={dragEnded}
                        dragEntered={dragEntered}
                        updateCard={updateCard}
                      />
                      {provided.placeholder}
                    </TaskList>
                  )}
                </Droppable>
              </div>
            </div>
          </div>
        </DragDropContext>
      </Transition>
    </>
  );
}

export default Home;
