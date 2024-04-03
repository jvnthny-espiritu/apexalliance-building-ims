import React, { useEffect, useState } from 'react';
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import RoomCard from '../components/RoomCard'; 

// Sample data
const firstFloorRooms = [
  { name: 'Room 101', dimension: '10x12', use: 'classroom', status: 'available' },
  { name: 'Room 102', dimension: '8x10', use: 'laboratory', status: 'available' },
  { name: 'Room 101', dimension: '10x12', use: 'classroom', status: 'available' },
  { name: 'Room 102', dimension: '8x10', use: 'laboratory', status: 'available' },
  { name: 'Room 101', dimension: '10x12', use: 'classroom', status: 'available' },
  { name: 'Room 102', dimension: '8x10', use: 'laboratory', status: 'available' }
];

const secondFloorRooms = [
  { name: 'Room 201', dimension: '10x12', use: 'classroom', status: 'available' },
  { name: 'Room 202', dimension: '8x10', use: 'laboratory', status: 'available' }
];

const thirdFloorRooms = [
  { name: 'Room ITL', dimension: '10x12', use: 'classroom', status: 'available' },
  { name: 'Room SL1', dimension: '8x10', use: 'laboratory', status: 'available' }
];

const fourthFloorRooms = [
  { name: 'Room 401', dimension: '10x12', use: 'classroom', status: 'available' },
  { name: 'Room 402', dimension: '8x10', use: 'laboratory', status: 'available' }
];

const fifthFloorRooms = [
  { name: 'Room 501', dimension: '10x12', use: 'classroom', status: 'available' },
  { name: 'Room 502', dimension: '8x10', use: 'laboratory', status: 'available' }
];



// Define other floor rooms similarly...

export default function RoomPage() {
  const [isFirstFloorOpen, setIsFirstFloorOpen] = useState(false);
  const [isSecondFloorOpen, setIsSecondFloorOpen] = useState(false);
  const [isThirdFloorOpen, setIsThirdFloorOpen] = useState(false);
  const [isFourthFloorOpen, setIsFourthFloorOpen] = useState(false);
  const [isFifthFloorOpen, setIsFifthFloorOpen] = useState(false);

  const toggleFirstFloor = () => setIsFirstFloorOpen(!isFirstFloorOpen);
  const toggleSecondFloor = () => setIsSecondFloorOpen(!isSecondFloorOpen);
  const toggleThirdFloor = () => setIsThirdFloorOpen(!isThirdFloorOpen);
  const toggleFourthFloor = () => setIsFourthFloorOpen(!isFourthFloorOpen);
  const toggleFifthFloor = () => setIsFifthFloorOpen(!isFifthFloorOpen);

  return (
    <div className="">
      <div className="fixed">
        <div className="fixed">
        </div>
        
        {/* Main content */}
        <div className="ml-1/4 p-4 overflow-y-auto h-screen w-auto "> 
          <div className="my-20 font-body ml-2"> 
            <div className="text-lg border-b-3 border-black "></div>
            <FloorSection
              floorName="First Floor"
              isOpen={isFirstFloorOpen}
              toggleOpen={toggleFirstFloor}
              rooms={firstFloorRooms}
            />
            <FloorSection
          floorName="Second Floor"
          isOpen={isSecondFloorOpen}
          toggleOpen={toggleSecondFloor}
          rooms={secondFloorRooms}
        />
            <FloorSection
                floorName="Third Floor"
                isOpen={isThirdFloorOpen}
                toggleOpen={toggleThirdFloor}
                rooms={thirdFloorRooms}
              />
            <FloorSection
                floorName="Fourth Floor"
                isOpen={isFourthFloorOpen}
                toggleOpen={toggleFourthFloor}
                rooms={fourthFloorRooms}
              />
            <FloorSection
                floorName="Fifth Floor"
                isOpen={isFifthFloorOpen}
                toggleOpen={toggleFifthFloor}
                rooms={fifthFloorRooms}
              />
          </div>
        </div>
      </div>
    </div>
  );
}

function FloorSection({ floorName, isOpen, toggleOpen, rooms }) {
  const ArrowIcon = isOpen ? MdOutlineArrowDropUp : MdOutlineArrowDropDown;

  return (
    <div className="mb-8"> 
      <div className="flex items-center justify-between pb-1 border-b border-black">
        <h2 className="font-bold text-2xl border-black">{floorName}</h2>
        <ArrowIcon
          className="w-10 h-10 ml-2 cursor-pointer"
          onClick={toggleOpen}
        />
      </div>
      
      <div className={` ${isOpen ? "" : "h-0 overflow-hidden"}`}>
        {rooms.map((room, index) => (
          <RoomCard key={index} room={room} />
        ))}
      </div>
    </div>
  );
}

