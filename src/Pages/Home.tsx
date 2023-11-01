import React, { useEffect, useState } from "react";
import { LogOut } from "react-feather";
import Board from "../Components/Board/Board";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Transition from "../transition/Transition";
import { DragDropContext, Droppable, DropResult, DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";
import styled from "styled-components";
import Card from "../Components/Card/Card";
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
  const [userImg, setUserImg] = useState<string>(
    "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Blonde&facialHairType=Blank&clotheType=ShirtCrewNeck&clotheColor=Pink&eyeType=Surprised&eyebrowType=AngryNatural&mouthType=Smile&skinColor=Light"
  ); 
  return (
    <>
      <div className="app_nav">
        <h1 onClick={() => navigateHandler('/home')}>KANBAN</h1>
        <div className="Nav-Icons">
          <img
            src={
              userImg
                ? userImg
                : "https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg"
            }
            alt="A"
            className="ProfileIcons"
            onClick={() => navigateHandler('/update')}
          />
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
