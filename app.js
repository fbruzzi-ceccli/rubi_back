require("dotenv").config();
const express = require("express");
var cors = require('cors');
const app = express();

app.use(express.json());

app.get('/', (req,res) => {
  res.send("node server");
});


const bodyParser = require('body-parser'); 
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


// const route1 = require('./api/get_all_objects.js'); // get all objetcs on map
const route2 = require('./api/get_vehicule_color.js'); // get vehicule color
const route3 = require('./api/get_vehicule_agent.js'); // get vehicule agent
const route4 = require('./api/get_vehicule_mission.js'); // get vehicule mission
const route5 = require('./api/get_point_stop_name.js'); // get vehicule stop name
const route6 = require('./api/get_vehicule_bodynumber.js'); // get vehicule body number
const route7 = require('./api/get_vehicule_trajectory_stops.js'); // get vehicule path (chemin) 
const route8 = require('./api/get_troncons_points.js');  // get troncons points
const route9 = require('./api/get_liaisons_dots.js');  // get troncons points
const route10 = require('./api/get_all_gateways.js');  // get all gateways (2-2)
const route12 = require('./api/get_all_depots.js');  // get all depots
const route13 = require('./api/get_all_paths.js');  // get all paths
const route14 = require('./api/get_vehicule_course_start_end_time.js');  // get vehicule course start & end time

const route15 = require('./api_realtime/get_time_gap.js');  // get course time gap (decalage)

const route16 = require('./api_test/login.js');  // get course time gap (decalage)

// app.use('/', route1); 
app.use('/', route2);
app.use('/', route3);
app.use('/', route4);
app.use('/', route5);
app.use('/', route6);
app.use('/', route7);
app.use('/', route8);
app.use('/', route9);
app.use('/', route10);
app.use('/', route12);
app.use('/', route13);
app.use('/', route14);
app.use('/', route15);
app.use('/', route16);

app.use('/', require('./api2/getDateKey.js'));
app.use('/', require('./api2/getCalculators.js'));
app.use('/', require('./api2/getLines.js'));
app.use('/', require('./api2/getPanelAndSatellite.js'));
app.use('/', require('./api2/getSoftwares.js'));
app.use('/', require('./api2/getStops.js'));
app.use('/', require('./api2/getAgents.js'));
app.use('/', require('./api2/getPortables.js'));
app.use('/', require('./api2/getVehicles2.js'));
app.use('/', require('./api2/getMissions.js'));
app.use('/', require('./api2/getMissionsCourses.js'));
app.use('/', require('./api2/getUsers.js'));
app.use('/', require('./api2/getVehicles.js'));
app.use('/', require('./api2/getSoftwares.js'));
app.use('/', require('./api2/getSoftwaresTerminal.js'));
app.use('/', require('./api2/getTerminals.js'));
app.use('/', require('./api2/getPanneaux.js'));
app.use('/', require('./api2/getSecteurs.js'));
app.use('/', require('./api2/getLinesServed.js'));
app.use('/', require('./api2/getVersions.js'));
app.use('/', require('./api2/getInformationBank.js'));
app.use('/', require('./api2/getEmbeddedSoftware.js'));
app.use('/', require('./api2/getConnectionHistory.js'));
app.use('/', require('./api2/getPredPass.js'));
app.use('/', require('./api2/getPathPoints.js'));
app.use('/', require('./api2/getStopPassHistory.js'));
app.use('/', require('./api2/getUnloading.js'));
app.use('/', require('./api2/getTechnicalWarnings.js'));
app.use('/', require('./api2/getCommunication.js'));
app.use('/', require('./api2/getApplications.js'));
app.use('/', require('./api2/getVehiclesTypes.js'));
app.use('/', require('./api2/getScenario.js'));
app.use('/', require('./api2/getSaphirParams.js'));

const PORT = process.env.APP_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});