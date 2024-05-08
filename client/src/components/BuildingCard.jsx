import React, { useState, useEffect } from 'react';
import { MdEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';
import api from '../services/api';

const BuildingCard = ({ building }) => {
  const { _id, name, campusId, yearOfCompletion, numFloor, purpose } = building;
  const [totalRooms, setTotalRooms] = useState(0);
  const [campusName, setCampusName] = useState('');

  useEffect(() => {
    const fetchTotalRooms = async () => {
      try {
        const response = await api.get(`/total-rooms/${_id}`);
        setTotalRooms(response.data.totalRooms);
      } catch (error) {
        console.error('Error fetching total rooms:', error);
      }
    };

    const fetchCampusName = async () => {
      try {
        const response = await api.get(`/campus/${campusId}`);
        setCampusName(response.data.name);
      } catch (error) {
        console.error('Error fetching campus name:', error);
      }
    };

    fetchTotalRooms();
    fetchCampusName();
  }, [_id, campusId]);

  const purposeColors = {
    Classroom: 'bg-[#00B178]',
    Laboratory: 'bg-[#712EE1]',
    Administrative: 'bg-[#F02556]'
  };

  return (
    <div className="w-[300px] h-[150px] my-16 md:my-20">
      <div className="bg-primary rounded-xl shadow-lg flex-shrink-0">
        <Link to={`/catalog/room/${_id}`} className="p-3 md:p-5 flex flex-col"> {/* Link to RoomPage with building ID */}
          <div className='building-name text-white text-[24px] md:text-2xl lg:text-[24px] font-black font-body mt-3'>
            <span className="flex items-center">
              <span className="text-[#FFD700]">{name}</span>
              <MdEdit className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 ml-2" />
            </span>
          </div>
          <div className='building-details text-white font-body text-sm md:text-base lg:text-[14px] mt-2 gap-2'>
            <p>Campus: <span className="ml-1">{campusName}</span></p>
            <p>Year of Completion: <span className="ml-1">{yearOfCompletion}</span></p>
            <p>No. of Stories: <span className="ml-1 md:ml-10">{numFloor}</span></p>
            <p>Total No. of Rooms: <span className="ml-1">{totalRooms}</span></p>
            <p>Purposes:</p>
            <ul className="ml-1 md:ml-3">
              {purpose && purpose.map((use, index) => (
                <li key={index} className={`building-use rounded-full mt-1 md:mt-2 text-center shadow-md hover:shadow-lg ${purposeColors[use]}`}>
                  {use}
                </li>
              ))}
            </ul>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BuildingCard;
