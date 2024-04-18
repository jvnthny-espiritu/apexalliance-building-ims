import React from 'react';

const ActivityLog = () => {
  
  const activities = [
    {
      username: 'Caryll',
      date: 'March 10, 2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: 'March 10, 2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: 'March 10, 2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: 'March 10, 2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: 'March 10, 2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: 'March 10, 2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: 'March 10, 2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: 'March 10, 2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: 'March 10, 2024',
      action: 'Added',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Caryll',
      date: 'March 10, 2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Klarizze Mae Jules Celemen',
      date: 'March 10, 2024',
      action: 'Deleted',
      description: 'CICS Building - Room 101 - Chairs'
    },
  ];


  return (
    <div className="relative my-5 mx-5 w-1/3 inset-y-0 right-px px-6 py-5 rounded-lg shadow-md bg-primary ">
      <h3 className="text-2xl font-black font-body text-white my-5">Activity Log</h3>
      <div className="logcard-container max-h-full overflow-y-auto absolute inset-0 mt-20"> {/* Adjusted max-h-80 and absolute positioning */}
        {activities.map((activity, index) => (
          <div key={index} className="logcard bg-slate-800/50 rounded-lg overflow-hidden shadow-md block mb-4 mx-4 hover:bg-slate-700">
            <div className="flex flex-col space-y-2 p-4">
              <div className="flex justify-between items-center">
                <p className="text-white">{activity.username}</p>
                <p className="text-white text-right">{activity.date}</p>
              </div>
              <p className="text-white">{`${activity.action} ${activity.description}`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;