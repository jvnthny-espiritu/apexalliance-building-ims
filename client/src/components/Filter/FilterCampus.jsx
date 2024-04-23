import { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const fetchCampusNames = async () => {
  return [
    "Alangilan",
    "Pablo Borbon",
    "Lemery",
    "Rosario",
  ];
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const FilterCampus = () => {
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [campuss, setCampuss] = useState([]);

  useEffect(() => {
    const fetchCampuss = async () => {
      try {
        const fetchedCampuss = await fetchCampusNames();
        setCampuss(fetchedCampuss);
      } catch (error) {
        console.error('Error fetching campuss:', error);
      }
    };

    fetchCampuss();
  }, []);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-800 hover:bg-gray-50">
          {selectedCampus || "Campus"}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-black-900" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-70 focus:outline-none">
          <div className="py-1">
            {campuss.map((campusName, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    type="button"
                    className={classNames(
                      active ? 'bg-gray-100 text-black-900' : 'text-black-700',
                      'block px-4 py-2 text-sm'
                    )}
                    onClick={() => setSelectedCampus(campusName)}
                  >
                    {campusName}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default FilterCampus;
