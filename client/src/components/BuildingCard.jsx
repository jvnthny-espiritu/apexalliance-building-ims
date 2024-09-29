import React, { useState, useEffect } from 'react';
import { MdEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';
import api from '../services/api';

const BuildingCard = ({ building }) => {
  const { _id, name, campus, yearOfCompletion, numFloor, purpose } = building;
  const [totalRooms, setTotalRooms] = useState(0);

  useEffect(() => {
    const fetchTotalRooms = async () => {
      try {
        const response = await api.get(`/building/${_id}/total-rooms`);
        setTotalRooms(response.data.totalRooms);
      } catch (error) {
        console.error('Error fetching total rooms:', error);
      }
    };

    fetchTotalRooms();
  }, [_id]);

  const purposeColors = {
    Classroom: 'bg-[#00B178]',
    Laboratory: 'bg-[#712EE1]',
    Administrative: 'bg-[#F02556]'
  };

  return (
    <div className="w-[300px] h-[250px] md:h-[300px] my-8 md:my-15 flex flex-col">
      <div className="bg-white rounded-xl shadow-lg flex-shrink-0 flex flex-col h-full border border-darkGray"> 
        <Link to={`/catalog/room/${_id}`} className="p-3 md:p-5 flex flex-col flex-grow">
          <div className='building-name text-black text-[24px] md:text-2xl lg:text-[24px] font-black font-body mt-3'>
            <span className="flex items-center">
              <span className="text-black">{name}</span>
              <MdEdit className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 ml-2" />
            </span>
          </div>
          <div className='text-darkGray font-body text-sm md:text-base lg:text-[14px] mt-2 gap-2 flex-grow'>
            <p className='flex justify-between font-bold'>Campus: <span className='font-normal'>{campus.name}</span></p>
            <p className='flex justify-between font-bold'>Year of Completion: <span className='font-normal'>{yearOfCompletion}</span></p>
            <p className='flex justify-between font-bold'>No. of Stories: <span className='font-normal'>{numFloor}</span></p>
            <p className='flex justify-between font-bold'>Total No. of Rooms: <span className='font-normal'>{totalRooms}</span></p>
            <p className='flex justify-between font-bold'>Purposes:</p>
            <ul className="ml-1 md:ml-3">
              {purpose && purpose.map((use, index) => (
                <li key={index} className={`building-use rounded-full mt-1 md:mt-2 text-center text-white shadow-md hover:shadow-lg ${purposeColors[use]}`}>
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
