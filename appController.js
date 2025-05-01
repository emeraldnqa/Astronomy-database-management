const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({ data: tableContent });
});

router.get('/celestial_body', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

router.post('/insert-star', async (req, res) => {
    const { cb_name, coordinate, visible, distance, diameter, temperature, spectral_class, luminosity_class, color, age } = req.body;
    const result = await appService.insertStar(cb_name, coordinate, visible, distance, diameter, temperature, spectral_class, luminosity_class, color, age);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post('/insert-observatory', async (req, res) => {
    const { obs_name, obs_id, obs_address } = req.body;
    const result = await appService.insertObservatory(obs_name, obs_id, obs_address);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post('/insert-telescope', async (req, res) => {
    const { tel_name, obs_id, manufactured_date, model } = req.body;
    const result = await appService.insertTelescope(tel_name, obs_id, manufactured_date, model);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post('/insert-picture', async (req, res) => {
    const { picture_id, date, link, tel_name, cb_name, coordinate } = req.body;
    const result = await appService.insertPicture(picture_id, date, link, tel_name, cb_name, coordinate);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post('/delete-celestial-body', async (req, res) => {
    const { cb_name, coordinate } = req.body;
    const result = await appService.deleteCelestialBody(cb_name, coordinate);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post('/update-celestial-body', async (req, res) => {
    const { cb_name, coordinate, updateData } = req.body;
    const result = await appService.updateCelestialBody(cb_name, coordinate, updateData);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post('/get-cb-within-dist', async (req, res) => {
    const { distance } = req.body;
    const result = await appService.getCelestialBodiesWithinDistance(distance);
    res.json({ data: result });
})

router.post('/fetch-astronomers-authored', async (req, res) => {
    const { ast_id, th_name, ph_name, ast_name } = req.body;
    const result = await appService.fetchAstronomersAuthored(ast_id, th_name, ph_name, ast_name);
    res.json({ data: result });
})

router.post('/search-observatories-telescopes', async (req, res) => {
    const { tel_name } = req.body;
    const result = await appService.searchObservatoriesTelecopes(tel_name);
    res.json({ data: result });
})

router.get('/aggregation-group-by', async (req, res) => {
    const result = await appService.hardCodedQueries(0);
    res.json({ data: result });
})

router.get('/aggregation-with-having', async (req, res) => {
    const result = await appService.hardCodedQueries(1);
    res.json({ data: result });
})

router.get('/nested-aggregation-with-group-by', async (req, res) => {
    const result = await appService.hardCodedQueries(2);
    res.json({ data: result });
})

router.get('/division', async (req, res) => {
    const result = await appService.hardCodedQueries(3);
    res.json({ data: result });
})


module.exports = router;
