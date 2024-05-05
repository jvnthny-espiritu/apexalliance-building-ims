import React from 'react';

const ActivityLog = () => {
  
  const activities = [
    {
      username: 'Caryll',
      date: '03-14-2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: '03-14-2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: '03-14-2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: '03-14-2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: '03-14-2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: '03-14-2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: '03-14-2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: '03-14-2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Princess May Tomongha',
      date: '03-14-2024',
      action: 'Added',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Caryll',
      date: '03-14-2024',
      action: 'Edited',
      description: 'CICS Building - Room 101 - Chairs'
    },
    {
      username: 'Klarizze Mae Jules Celemen',
      date: '03-14-2024',
      action: 'Deleted',
      description: 'CICS Building - Room 101 - Chairs'
    },
  ];



  return (
    <div className="flex-grow-1 h-fit ml-2 px-6 py-5 rounded-lg shadow-md bg-primary overflow-hidden">
      <h3 className="text-2xl font-black font-body text-white my-5">Activity Log</h3>
      <div className="h-[860px] mb-5 overflow-y-scroll">
        {activities.map((activity, index) => (
          <div key={index} className="bg-slate-800/50 rounded-lg shadow-md block mb-4 mx-4 hover:bg-slate-700">
            <div className="flex flex-col space-y-2 p-4">
              <div className="flex justify-between items-center">
                <p className="text-white font-black">{activity.username}</p>
                <p className="text-white text-xs text-right">{activity.date}</p>
              </div>
              <p className="text-white text-xs font-light">{`${activity.action} ${activity.description}`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;