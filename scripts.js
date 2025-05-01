/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchCelestialBodies() {
    const tableElement = document.getElementById('celestial_body');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/celestial_body', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// async function fetchHardCodedQueries() {
//     let response;
//     let responseData;
//     let tableContent;
//     let tableElement;
//     let tableBody;

//     const queries = [
//         { route: '/aggregation-group-by', id: 'aggregation-group-by' },
//         { route: '/aggregation-with-having', id: 'aggregation-with-having' },
//         { route: '/nested-aggregation-with-group-by', id: 'nested-aggregation-with-group-by' },
//         { route: '/division', id: 'division' }
//     ]

//     queries.forEach(
//         async (query) => {
//         response = await fetch(query.route, {
//             method: 'GET'
//         });

//         responseData = await response.json();
//         tableContent = responseData.data;

//         tableElement = document.getElementById(query.id);
//         tableBody = tableElement.querySelector('tbody');

//         if (tableBody) {
//             tableBody.innerHTML = '';
//         }

//         tableContent.forEach(user => {
//             const row = tableBody.insertRow();
//             user.forEach((field, index) => {
//                 const cell = row.insertCell(index);
//                 cell.textContent = field;
//             });
//         });
//     });
// }

// Fetch hard-coded aggregation
async function fetchHardCodedQueries(route, elementID) {
    const tableElement = document.getElementById(elementID);
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch(route, {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchAggregationGroupBy() {
    await fetchHardCodedQueries('/aggregation-group-by', 'aggregation-group-by')
}

async function fetchAggregationHaving() {
    await fetchHardCodedQueries('aggregation-with-having', 'aggregation-with-having')
}

async function fetchNestedAggregationGroupBy() {
    await fetchHardCodedQueries('/nested-aggregation-with-group-by', 'nested-aggregation-with-group-by' )
}

async function fetchDvision() {
    await fetchHardCodedQueries('/division', 'division' )
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}

async function runSqlFile() {
    const response = await fetch("/run-sql-file", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('sqlResultMsg');

    if (responseData.success) {
        messageElement.textContent = "SQL file successfully run!";
    } else {
        messageElement.textContent = "SQL file had some errors!";
    }
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function coord(num, str) {
    if (num > 0) {
        return "+" + str;
    }
    return str;
}

async function insertStar() {
    event.preventDefault();

    const cb_name = document.getElementById('insertCbName').value;

    const coordinate_hour = document.getElementById('insertCoordinateHour').value;
    const coordinate_minute = document.getElementById('insertCoordinateMinute').value;
    const coordinate_degree = document.getElementById('insertCoordinateDegree').value;
    const coordinate_arcminute = document.getElementById('insertCoordinateArcminute').value;
    const coordinate = `RA ${pad(coordinate_hour, 2)}h ${pad(coordinate_minute, 2)}m, Dec ${coord(coordinate_degree, pad(coordinate_degree, 2))}degree ${pad(coordinate_arcminute, 2)}`;

    const visible = document.getElementById('insertVisible').checked ? 1 : 0;
    const distance = document.getElementById('insertDistance').value;
    const diameter = document.getElementById('insertDiameter').value;
    const temperature = document.getElementById('insertTemperature').value;
    const spectral_class = document.getElementById('insertSpectralClass').value;
    const luminosity_class = document.getElementById('insertLuminosityClass').value;
    const color = document.getElementById('insertColor').value;
    const age = document.getElementById('insertAge').value;

    const response = await fetch('/insert-star', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cb_name,
            coordinate,
            visible,
            distance,
            diameter,
            temperature,
            spectral_class,
            luminosity_class,
            color,
            age
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertStarResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Star inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Star insert had some errors!";
    }
}

async function insertObservatory() {
    event.preventDefault();

    const obs_name = document.getElementById('insertObsName').value;
    const obs_id = document.getElementById('insertObsId').value;
    const obs_address = document.getElementById('insertAddress').value;

    const response = await fetch('/insert-observatory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            obs_name,
            obs_id,
            obs_address
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertObsResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Observatory inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Observatory insert had some errors!";
    }
}

async function insertTelescope() {
    event.preventDefault();

    const tel_name = document.getElementById('insertTelName').value;
    const obs_id = document.getElementById('insertObsId').value;
    const manufactured_date = document.getElementById('insertTelManufactureDate').value;
    const model = document.getElementById('insertTelModel').value;

    const response = await fetch('/insert-telescope', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tel_name,
            obs_id,
            manufactured_date,
            model
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertTelResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Telescope inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Telescope insert had some errors!";
    }
}

async function insertPicture() {
    event.preventDefault();

    const picture_id = document.getElementById('insertPictureId').value;
    const date = document.getElementById('insertPictureDate').value;
    const link = document.getElementById('insertPictureLink').value;
    const tel_name = document.getElementById('insertPictureTelName').value;

    const cb_name = document.getElementById('insertPictureCbName').value;

    const coordinate_hour = document.getElementById('insertPictureCoordinateHour').value;
    const coordinate_minute = document.getElementById('insertPictureCoordinateMinute').value;
    const coordinate_degree = document.getElementById('insertPictureCoordinateDegree').value;
    const coordinate_arcminute = document.getElementById('insertPictureCoordinateArcminute').value;
    const coordinate = `RA ${pad(coordinate_hour, 2)}h ${pad(coordinate_minute, 2)}m, Dec ${coord(coordinate_degree, pad(coordinate_degree, 2))}degree ${pad(coordinate_arcminute, 2)}`;

    const response = await fetch('/insert-picture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            picture_id,
            date,
            link,
            tel_name,
            cb_name,
            coordinate,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertPictureResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Picture inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Picture insert had some errors!";
    }
}

async function deleteCelestialBody() {
    event.preventDefault();

    const cb_name = document.getElementById('deleteCbName').value;

    const coordinate_hour = document.getElementById('deleteCoordinateHour').value;
    const coordinate_minute = document.getElementById('deleteCoordinateMinute').value;
    const coordinate_degree = document.getElementById('deleteCoordinateDegree').value;
    const coordinate_arcminute = document.getElementById('deleteCoordinateArcminute').value;
    const coordinate = `RA ${pad(coordinate_hour, 2)}h ${pad(coordinate_minute, 2)}m, Dec ${coord(coordinate_degree, pad(coordinate_degree, 2))}degree ${pad(coordinate_arcminute, 2)}`;

    const response = await fetch('/delete-celestial-body', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cb_name,
            coordinate
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteCelestialBodyResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Celestial body deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Celestial body delete had some errors!";
    }
}

async function updateCelestialBody() {
    event.preventDefault();

    const cb_name = document.getElementById('updateCbName').value;

    const coordinate_hour = document.getElementById('updateCoordinateHour').value;
    const coordinate_minute = document.getElementById('updateCoordinateMinute').value;
    const coordinate_degree = document.getElementById('updateCoordinateDegree').value;
    const coordinate_arcminute = document.getElementById('updateCoordinateArcminute').value;
    const coordinate = `RA ${pad(coordinate_hour, 2)}h ${pad(coordinate_minute, 2)}m, Dec ${coord(coordinate_degree, pad(coordinate_degree, 2))}degree ${pad(coordinate_arcminute, 2)}`;
    console.log(coordinate);

    // const shouldUpdateCbName = document.getElementById('shouldUpdateCbName').checked;
    // const shouldUpdateCbCoordinate = document.getElementById('shouldUpdateCbCoordinate').checked;
    const shouldUpdateVisibile = document.getElementById('shouldUpdateVisible').checked;
    const shouldUpdateDistance = document.getElementById('shouldUpdateDistance').checked;
    const shouldUpdateDiameter = document.getElementById('shouldUpdateDiameter').checked;

    const shouldUpdateTemperature = document.getElementById('shouldUpdateTemperature').checked;
    const shouldUpdateSpectralClass = document.getElementById('shouldUpdateSpectralClass').checked;
    const shouldUpdateLuminosityClass = document.getElementById('shouldUpdateLuminosityClass').checked;
    const shouldUpdateColor = document.getElementById('shouldUpdateColor').checked;
    const shouldUpdateAge = document.getElementById('shouldUpdateAge').checked;

    let updateData = {};

    // if (shouldUpdateCbName) {
    //     const newName = document.getElementById('newCbName').value;
    //     updateData.cb_name = newName;
    // }
    // if (shouldUpdateCbCoordinate) {
    //     const coordinate_hour = document.getElementById('newCoordinateHour').value;
    //     const coordinate_minute = document.getElementById('newCoordinateMinute').value;
    //     const coordinate_degree = document.getElementById('newCoordinateDegree').value;
    //     const coordinate_arcminute = document.getElementById('newCoordinateArcminute').value;
    //     const coordinate = `RA ${pad(coordinate_hour, 2)}h ${pad(coordinate_minute, 2)}m, Dec ${coord(coordinate_degree, pad(coordinate_degree, 2))}degree ${pad(coordinate_arcminute, 2)}`;
    //     updateData.coordinate = new_coordinate;
    // }
    if (shouldUpdateVisibile) {
        updateData.visible = document.getElementById('newVisible').checked ? 1 : 0;
    }
    if (shouldUpdateDistance) {
        updateData.distance = document.getElementById('newDistance').value;
    }
    if (shouldUpdateDiameter) {
        updateData.diameter = document.getElementById('newDiameter').value;
    }
    if (shouldUpdateTemperature) {
        updateData.temperature = document.getElementById('newTemperature').value;
    }
    if (shouldUpdateSpectralClass) {
        updateData.spectral_class = document.getElementById('newSpectralClass').value;
    }
    if (shouldUpdateLuminosityClass) {
        updateData.luminosity_class = document.getElementById('newLuminosityClass').value;
    }
    if (shouldUpdateColor) {
        updateData.color = document.getElementById('newColor').value;
    }
    if (shouldUpdateAge) {
        updateData.age = document.getElementById('newAge').value;
    }

    const response = await fetch('/update-celestial-body', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cb_name,
            coordinate,
            updateData
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateCelestialBodyResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Celestial body updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Celestial body update had some errors!";
    }
}

async function getCelestialBodiesWithinDistance() {
    event.preventDefault();

    const tableElement = document.getElementById('celestial_bodies_within_distance');
    const tableBody = tableElement.querySelector('tbody');

    const distance = document.getElementById('celestialBodyCheckDistanceValue').value;

    const response = await fetch('/get-cb-within-dist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            distance
        })
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchAstronomersAuthored() {
    const tableElement = document.getElementById('astronomers_authored');
    const tableBody = tableElement.querySelector('tbody');
    const tableHead = document.querySelector("#astronomers_authored thead tr");
    tableHead.innerHTML = "";

    const fields = [
        { id: "astronomersAuthoredAstID", name: "Astronomer ID" },
        { id: "astronomersAuthoredThName", name: "Theory Name" },
        { id: "astronomersAuthoredPhName", name: "Phenomena Name" },
        { id: "astronomersAuthoredAstName", name: "Astronomer Name" }
    ];

    const fields_checked = [];

    fields.forEach(field => {
        const checked = document.getElementById(field.id).checked;
        if (checked) {
            let th = document.createElement("th");
            th.textContent = field.name;
            tableHead.appendChild(th);
        }
        fields_checked.push(checked);
    });

    const response = await fetch('/fetch-astronomers-authored', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ast_id: fields_checked[0],
            th_name: fields_checked[1],
            ph_name: fields_checked[2],
            ast_name: fields_checked[3],
        })
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function searchObservatoriesTelecopes() {
    event.preventDefault();

    const tableElement = document.getElementById('search_observatories_telecopes');
    const tableBody = tableElement.querySelector('tbody');
    const msg = document.getElementById('observatoriesTelecopesMsg');

    const telName = document.getElementById('observatoriesTelecopesThName').value;

    const response = await fetch('/search-observatories-telescopes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tel_name: telName
        })
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
    if (tableContent.length == 0) {
        msg.textContent = "No such telescope exists";
    } else {
        msg.textContent = "";
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    //fetchOtherData();
    // document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);

    document.getElementById("insertStar").addEventListener("submit", insertStar);
    document.getElementById("insertObservatory").addEventListener("submit", insertObservatory);
    document.getElementById("insertTelescope").addEventListener("submit", insertTelescope);
    document.getElementById("insertPicture").addEventListener("submit", insertPicture);
    document.getElementById("deleteCelestialBody").addEventListener("submit", deleteCelestialBody);
    document.getElementById("updateCelestialBody").addEventListener("submit", updateCelestialBody);
    document.getElementById("celestialBodyCheckDistance").addEventListener("submit", getCelestialBodiesWithinDistance);
    document.getElementById("astronomersAuthoredFetch").addEventListener("click", fetchAstronomersAuthored);
    document.getElementById("observatoriesTelecopes").addEventListener("submit", searchObservatoriesTelecopes);
    // Fetch aggregation queries
    document.getElementById("refresh-tables").addEventListener("click", fetchTableData);
    document.getElementById("find-max-dist").addEventListener("click", fetchAggregationGroupBy);
    document.getElementById("find-oldest-tel").addEventListener("click", fetchAggregationHaving);
    document.getElementById("find-avg-count").addEventListener("click", fetchNestedAggregationGroupBy);
    document.getElementById("find-obs").addEventListener("click", fetchDvision);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    // fetchAndDisplayUsers();
    fetchCelestialBodies();
}

// function fetchOtherData() {
//     fetchHardCodedQueries();
// }
