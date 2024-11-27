const Building = require("../models/Building");
const Campus = require("../models/Campus"); 

async function getCampusId(campusName) {
  if (!campusName) return null;
  const campus = await Campus.findOne({ name: new RegExp(`^${campusName}$`, "i") });
  return campus ? campus._id : null;
}

async function getBuildingsByCampus(campus) {
  const query = {};

  if (campus) {
    const campusId = await getCampusId(campus);
    if (!campusId) {
      throw new Error("Invalid campus");
    }
    query.campus = campusId;
  }

  const buildings = await Building.find(query).populate("campus", "name");
  return buildings;
}

module.exports = { getCampusId, getBuildingsByCampus };
