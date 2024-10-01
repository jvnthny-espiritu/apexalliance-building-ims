import React, { useState, useEffect } from 'react';
import api from '../services/api';


const BuildingInfo = ({ building, }) => {
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


  return (
    <div className="w-min-full  h-[150px] md:h-[175px] my-8 md:my-15 flex flex-col relative">
      <div className="bg-white rounded-xl shadow-lg flex-shrink-0 flex flex-col h-full border border-darkGray">
          <div className='building-name text-black text-[24px] md:text-2xl lg:text-[24px] font-black font-body mt-3 px-10'>
            <span className="flex items-center justify-between">
              <span className="text-black">{name}</span>
              </span>
          </div>
          <div className='text-darkGray font-body text-sm md:text-base lg:text-[14px] mt-2 gap-2 flex-grow px-10'>
            <p className='flex justify-between font-bold'>Campus: <span className='font-normal'>{campus.name}</span></p>
            <p className='flex justify-between font-bold'>Year of Completion: <span className='font-normal'>{yearOfCompletion}</span></p>
            <p className='flex justify-between font-bold'>No. of Stories: <span className='font-normal'>{numFloor}</span></p>
            <p className='flex justify-between font-bold'>Total No. of Rooms: <span className='font-normal'>{totalRooms}</span></p>
          </div>
      </div>
    </div>
  );
};

export default BuildingInfo;
