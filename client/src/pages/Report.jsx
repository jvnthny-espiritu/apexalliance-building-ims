import React from 'react';

export default function Report() {
  return (
    <div>
    <h2 className="mb-2 mt-0 text-3xl font-medium text-primary">
      REPORTS
    </h2>
    <div  className="flex flex-col overflow-x-auto">
      <div className=" h-screen flex items-center justify-center text-white">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 bg-primary	">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4">BUILDING</th>
                  <th scope="col" className="px-6 py-4">FLOOR</th>
                  <th scope="col" className="px-6 py-4">ROOM</th>
                  <th scope="col" className="px-6 py-4">DIMENSION</th>
                  <th scope="col" className="px-6 py-4">USE</th>
                  <th scope="col" className="px-6 py-4">STATUS</th>
                  <div class="col-span-3 grow"> <th scope="col" className="px-6 py-4">1</th></div>
                  <div class="col-span-2"> <th scope="col" className="px-6 py-4">2</th></div>
                  <div class="col-span-2"> <th scope="col" className="px-6 py-4">3</th></div>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap px-6 py-4 font-medium">1</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                </tr>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap px-6 py-4 font-medium ">2</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4 ">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4 ">Cell</td>
                </tr>
                <tr className="border-b ">
                  <td className="whitespace-nowrap px-6 py-4 font-medium ">3</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                  <td className="whitespace-nowrap px-6 py-4">Cell</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}