import React, { useState } from "react";
import { MoreHorizontal } from "react-feather";
import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import Editable from "../Editabled/Editable";
import CardInfo from "../Card/CardInfo/CardInfo";
import "./Board.css";
import { DroppableProvided } from "react-beautiful-dnd";
import styled from "styled-components";

const TaskList = styled.div`
  background-color: #f4f5f7;
`;
interface Label {
  text: string;
  color: string;
}


interface BoardProps {
  board: {
    id: number;
    _id:number;
    title: string;
    cards: Card[];
    // Define other properties if needed
  };
  card: Card;
  removeCard: (bid: number, cid: number) => void;
  dragEntered: (bid: string, cid: string) => void;
 
  dragEnded: (bid: string, cid: string) => void;
  updateCard: (bid: number, cid: number, card: Card) => void;
  addCard: (bid: number, title: string) => void;
}

const Board: React.FC<BoardProps> = (props) => {
  const [showModal, setShowModal] = useState(false);
  console.log(props);
  
  return (
    <>
      {showModal && (
        <CardInfo                        //Modal Component Form
          onClose={() => setShowModal(false)}
          card={props.card}
          boardId={props.board._id}
          updateCard={props.updateCard}  
        />
      )}
      <div className="board">
        <div className="board_header">
          <p className="board_header_title">
            {props.board?.title}
            <span>{props.board?.cards?.length || 0}</span>
          </p>
        </div>
        <div className="board_cards custom-scroll">
          {props.board?.cards?.map((item, idx) => (
            <Card                                    // Card Component for board
              key={item.id}
              card={item}
              boardId={props.board._id}
              removeCard={props.removeCard}
              dragEntered={props.dragEntered}
              dragEnded={props.dragEnded}
              updateCard={props.updateCard}
              index={idx}
            />
          ))}
        <Editable                                 // Standard Editable Add Input Component       
  text="+ Add Card"
  placeholder="Enter Card Title"
  displayClass="board_add-card"
  editClass="board_add-card_edit"
  onSubmit={(value: string) => props.addCard(props.board._id, value)}
/>

        </div>
      </div>
    </>
  );
};

export default Board;
