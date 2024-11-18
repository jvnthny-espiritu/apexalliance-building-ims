import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const LogCard = ({ logs }) => {
    return (
        <div className='flex flex-col p-4 border-4 border-primary rounded-lg shadow-lg bg-white h-[620px]'>
            <div className='flex items-center mt-5 ml-5'>
                <div className='text-primary mr-2'>
                    <FaChartLine />
                </div>
                <p className='text-lg font-semibold'>User Action Logs</p>
            </div>
            <div className='mt-4 w-full text-center overflow-y-auto h-[500px]'>
                {logs.length === 0 ? (
                    <p>No logs available.</p>
                ) : (
                    <ul className='list-disc list-inside text-left'>
                        {logs.map((log) => (
                            <li key={log._id} className='text-sm mt-2'>
                                <strong>{new Date(log.timestamp).toLocaleString()}</strong>: {log.message}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LogCard;