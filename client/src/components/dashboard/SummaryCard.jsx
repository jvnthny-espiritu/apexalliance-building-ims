import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const SummaryCard = () => {
    return (
        <div className='flex flex-col items-center justify-center p-4 border-4 border-primary border-opacity-50 rounded-lg shadow-lg bg-white h-full'>
            <div className='text-primary mb-2'>
                <FaChartLine />
            </div>
            <p className='text-lg font-semibold'>Summary</p>
        </div>
    );
};

export default SummaryCard;