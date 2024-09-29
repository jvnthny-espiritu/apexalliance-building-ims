import React, { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const BuildingCard = ({ building, onDelete }) => {
  const { _id, name, campus, yearOfCompletion, numFloor, purpose } = building;
  const [totalRooms, setTotalRooms] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate(); // Use this for navigation (e.g., for editing)

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
    Classroom: 'bg-room-use-classroom',
    Laboratory: 'bg-room-use-laboratory',
    Administrative: 'bg-room-use-administrative'
  };

  // Toggle dropdown
  const toggleDropdown = (event) => {
    event.stopPropagation(); // Prevent the Link from being triggered
    event.preventDefault(); // Prevent default behavior of the click event
    setDropdownVisible(!dropdownVisible);
  };

  // Handle Edit Action (redirect to edit form)
  const handleEdit = (event) => {
    event.stopPropagation(); // Prevent the Link from being triggered
    navigate(`/edit-building/${_id}`);
  };

  // Handle Delete Action (call API to delete)
  const handleDelete = async (event) => {
    event.stopPropagation(); // Prevent the Link from being triggered
    try {
      await api.delete(`/building/${_id}`);
      onDelete(_id); // Inform parent to update the list (if necessary)
    } catch (error) {
      console.error('Error deleting building:', error);
    } finally {
      setDropdownVisible(false);
    }
  };

  return (
    <div className="w-[300px] h-[250px] md:h-[300px] my-8 md:my-15 flex flex-col relative">
      <div className="bg-white rounded-xl shadow-lg flex-shrink-0 flex flex-col h-full border border-darkGray">
        <Link to={`/catalog/room/${_id}`} className="p-3 md:p-5 flex flex-col flex-grow">
          <div className='building-name text-black text-[24px] md:text-2xl lg:text-[24px] font-black font-body mt-3'>
            <span className="flex items-center justify-between">
              <span className="text-black">{name}</span>
              <span onClick={toggleDropdown} className="relative cursor-pointer">
                <BsThreeDotsVertical className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 ml-2" />
                {dropdownVisible && (
                  <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <li 
                      onClick={handleEdit} 
                      className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                    >
                      Edit
                    </li>
                    <li 
                      onClick={handleDelete} 
                      className="px-4 py-2 hover:bg-red-500 hover:text-white cursor-pointer"
                    >
                      Delete
                    </li>
                  </ul>
                )}
              </span>
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
