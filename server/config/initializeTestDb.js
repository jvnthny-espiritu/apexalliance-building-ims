require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Campus = require('../models/Campus');
const User = require('../models/User');
const Building = require('../models/Building');
const Room = require('../models/Room');
const Asset = require('../models/Asset');
const updateBuildingFacilities = require('../utils/updateBuildingFacilities');

const initializeDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);

    // Delete existing data
    await Campus.deleteMany({});
    await User.deleteMany({});
    await Building.deleteMany({});
    await Room.deleteMany({});
    await Asset.deleteMany({});

    // Insert campuses
    const campuses = await Campus.insertMany([
      { name: 'Alangilan' },
      { name: 'Pablo Borbon' },
      { name: 'ARASOF-Nasugbu' }
    ]);

    // Hash passwords
    const hashedAdminPassword = await bcrypt.hash('admin', 10);
    const hashedStaffPassword = await bcrypt.hash('staff', 10);
    const hashedGuestPassword = await bcrypt.hash('guest', 10);

    // Insert users
    const users = await User.insertMany([
      {
        username: 'admin',
        fullname: { firstName: 'Admin', lastName: 'User' },
        password: hashedAdminPassword,
        role: 'admin',
        campus: campuses[0]._id,
      },
      {
        username: 'staff1',
        fullname: { firstName: 'Staff', lastName: 'User1' },
        password: hashedStaffPassword,
        role: 'staff',
        campus: campuses[1]._id,
      },
      {
        username: 'staff2',
        fullname: { firstName: 'Staff', lastName: 'User2' },
        password: hashedStaffPassword,
        role: 'staff',
        campus: campuses[2]._id,
      },
      {
        username: 'guest1',
        fullname: { firstName: 'Guest', lastName: 'User1' },
        password: hashedGuestPassword,
        role: 'guest',
        campus: campuses[0]._id,
      },
      {
        username: 'guest2',
        fullname: { firstName: 'Guest', lastName: 'User2' },
        password: hashedGuestPassword,
        role: 'guest',
        campus: campuses[1]._id,
      },
    ]);

    // Insert buildings
    const buildings = [];
    for (const campus of campuses) {
      for (let i = 1; i <= 2; i++) {
        buildings.push({
          name: `Building ${i} - ${campus.name}`,
          campus: campus._id,
          numberOfFloors: 3,
          yearBuilt: 2000 + i,
          facilities: []
        });
      }
    }
    const insertedBuildings = await Building.insertMany(buildings);

    // Insert rooms
    const rooms = [];
    for (const building of insertedBuildings) {
      for (let floor = 1; floor <= building.numberOfFloors; floor++) {
        for (let i = 1; i <= 2; i++) {
          rooms.push({
            building: building._id,
            name: `Room ${i} - Floor ${floor}`,
            floor: floor,
            purpose: `Purpose ${i}`,
            status: 'Available'
          });
        }
      }
    }
    const insertedRooms = await Room.insertMany(rooms);

    // Insert assets
    const assets = [];
    for (const room of insertedRooms) {
      for (let i = 1; i <= 3; i++) {
        assets.push({
          name: `Asset ${i} - ${room.name}`,
          category: 'electric',
          condition: 'new',
          status: 'good condition',
          location: room._id,
          purchaseDate: new Date(),
          value: 1000 * i,
          numberOfUnits: 1,
          electricDetails: {
            voltage: 220,
            power: 100 * i,
            manufacturer: 'Manufacturer A',
            warranty: '1 year'
          }
        });
      }
    }
    await Asset.insertMany(assets);

    // Update building facilities
    for (const building of insertedBuildings) {
      await updateBuildingFacilities(building._id);
    }

    // // Insert buildings
    // const buildings = await Building.insertMany([
    //   {
    //     name: 'Engineering Building',
    //     campus: campuses[0]._id,
    //     numberOfFloors: 5,
    //     yearBuilt: 2000,
    //     facilities: ['Library', 'Laboratory'],
    //   },
    //   {
    //     name: 'Science Building',
    //     campus: campuses[1]._id,
    //     numberOfFloors: 3,
    //     yearBuilt: 1995,
    //     facilities: ['Lecture Hall', 'Laboratory'],
    //   },
    //   {
    //     name: 'Arts Building',
    //     campus: campuses[2]._id,
    //     numberOfFloors: 4,
    //     yearBuilt: 2010,
    //     facilities: ['Classroom', 'Studio'],
    //   },
    //   {
    //     name: 'Business Building',
    //     campus: campuses[3]._id,
    //     numberOfFloors: 6,
    //     yearBuilt: 2015,
    //     facilities: ['Conference Room', 'Office'],
    //   },
    //   {
    //     name: 'Medical Building',
    //     campus: campuses[4]._id,
    //     numberOfFloors: 7,
    //     yearBuilt: 2020,
    //     facilities: ['Clinic', 'Laboratory'],
    //   },
    // ]);

    // // Insert rooms
    // const rooms = await Room.insertMany([
    //   {
    //     building: buildings[0]._id,
    //     name: 'Room 101',
    //     floor: 1,
    //     purpose: 'Library',
    //     status: 'Available',
    //   },
    //   {
    //     building: buildings[0]._id,
    //     name: 'Room 102',
    //     floor: 1,
    //     purpose: 'Laboratory',
    //     status: 'Occupied',
    //   },
    //   {
    //     building: buildings[1]._id,
    //     name: 'Room 201',
    //     floor: 2,
    //     purpose: 'Lecture Hall',
    //     status: 'Available',
    //   },
    //   {
    //     building: buildings[1]._id,
    //     name: 'Room 202',
    //     floor: 2,
    //     purpose: 'Laboratory',
    //     status: 'Occupied',
    //   },
    //   {
    //     building: buildings[2]._id,
    //     name: 'Room 301',
    //     floor: 3,
    //     purpose: 'Classroom',
    //     status: 'Available',
    //   },
    //   {
    //     building: buildings[2]._id,
    //     name: 'Room 302',
    //     floor: 3,
    //     purpose: 'Studio',
    //     status: 'Occupied',
    //   },
    //   {
    //     building: buildings[3]._id,
    //     name: 'Room 401',
    //     floor: 4,
    //     purpose: 'Conference Room',
    //     status: 'Available',
    //   },
    //   {
    //     building: buildings[3]._id,
    //     name: 'Room 402',
    //     floor: 4,
    //     purpose: 'Office',
    //     status: 'Occupied',
    //   },
    //   {
    //     building: buildings[4]._id,
    //     name: 'Room 501',
    //     floor: 5,
    //     purpose: 'Clinic',
    //     status: 'Available',
    //   },
    //   {
    //     building: buildings[4]._id,
    //     name: 'Room 502',
    //     floor: 5,
    //     purpose: 'Laboratory',
    //     status: 'Occupied',
    //   },
    // ]);

    // // Insert assets
    // const assets = await Asset.insertMany([
    //   {
    //     name: 'Microscope',
    //     category: 'electric',
    //     condition: 'good',
    //     status: 'good condition',
    //     location: rooms[1]._id,
    //     purchaseDate: new Date('2020-01-01'),
    //     value: 1000,
    //     numberOfUnits: 10,
    //     electricDetails: {
    //       voltage: 220,
    //       power: 50,
    //       manufacturer: 'Optics Co.',
    //       warranty: '2 years',
    //     },
    //   },
    //   {
    //     name: 'Projector',
    //     category: 'electric',
    //     condition: 'new',
    //     status: 'good condition',
    //     location: rooms[2]._id,
    //     purchaseDate: new Date('2021-06-15'),
    //     value: 500,
    //     numberOfUnits: 5,
    //     electricDetails: {
    //       voltage: 220,
    //       power: 100,
    //       manufacturer: 'Tech Corp.',
    //       warranty: '1 year',
    //     },
    //   },
    //   {
    //     name: 'Whiteboard',
    //     category: 'non-electric',
    //     condition: 'good',
    //     status: 'good condition',
    //     location: rooms[4]._id,
    //     purchaseDate: new Date('2019-09-10'),
    //     value: 200,
    //     numberOfUnits: 20,
    //     nonElectricDetails: {
    //       material: 'Aluminum',
    //       dimensions: '4x6 feet',
    //       weight: 15,
    //     },
    //   },
    //   {
    //     name: 'Stethoscope',
    //     category: 'non-electric',
    //     condition: 'new',
    //     status: 'good condition',
    //     location: rooms[9]._id,
    //     purchaseDate: new Date('2022-03-01'),
    //     value: 150,
    //     numberOfUnits: 30,
    //     nonElectricDetails: {
    //       material: 'Steel',
    //       dimensions: '1x1 feet',
    //       weight: 1,
    //     },
    //   },
    //   {
    //     name: 'Computer',
    //     category: 'electric',
    //     condition: 'good',
    //     status: 'good condition',
    //     location: rooms[7]._id,
    //     purchaseDate: new Date('2018-11-20'),
    //     value: 1200,
    //     numberOfUnits: 15,
    //     electricDetails: {
    //       voltage: 220,
    //       power: 500,
    //       manufacturer: 'CompTech',
    //       warranty: '3 years',
    //     },
    //   },
    // ]);

    console.log('Database initialized with test data');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
};

initializeDatabase();