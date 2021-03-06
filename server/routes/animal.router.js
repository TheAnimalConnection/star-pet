const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const multer = require("multer");
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');


//AWS3
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const app = express();
const s3 = new aws.S3({
    accessKeyID: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// const upload = multer({ dest: 'public/uploads/' })

//Multer s3 upload
const upload = multer({
    storage: multerS3({
    s3: s3,
    bucket: "starpet-prime",
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        cb(null, Date.now() + `--` + file.originalname)
    },
    }),
});



router.get('/',  rejectUnauthenticated,(req, res) => {
    console.log('******* GET ANIMALS *******', req.params);
    const qFilter = req.query;
    const sqlQuery = queryGen(qFilter)
    let queryText = 


        `SELECT "animals".*, contacts."firstName",contacts."lastName",contacts."primaryNumber"
      FROM "animals"
    JOIN "contacts" 
      ON "animals"."contactsId" = contacts.id 
   

        ${sqlQuery.sqlString};`
    pool.query(queryText, sqlQuery.sqlParams)
        .then(dbRes => { res.send(dbRes.rows)})
        .catch((err) => {
            console.log('User registration failed: ', err);
            res.sendStatus(500);
        });
});

router.get('/:id', rejectUnauthenticated, async (req, res) => {
    try {
        console.log('IN GET /ANIMAL/:ID, REQ.PARAMS IS:', req.params)
        const queryText = `
        SELECT
            "animals".*,
            JSON_AGG(DISTINCT "contacts".*) AS contact,
            JSON_AGG(DISTINCT "auditions") AS auditions,
            JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                'id', "jobs"."id",
                'description', "jobs"."description",
                'number', "jobs"."jobNumber",
                'date', "jobs"."date",
                'client', "jobs"."client",
                'active', "jobs"."active",
                'notes', "jobs"."notes",
                'paid', "jobsJunction"."paid",
                'checkNumber', "jobsJunction"."checkNumber",
                'checkAmount', "jobsJunction"."checkAmount",
                'checkDate', "jobsJunction"."checkDate"
                )) AS jobs
        FROM "animals"
        JOIN "contacts"
            ON "contacts"."id" = "animals"."contactsId"
        LEFT JOIN "auditions"
            ON "auditions"."animalsId" = "animals"."id"
        LEFT JOIN "jobsJunction"
            ON "jobsJunction"."animalsId" = "animals"."id"
        LEFT JOIN "jobs"
            ON "jobsJunction"."jobId" = "jobs"."id"
        WHERE "animals"."id" = $1
        GROUP BY "animals"."id";
        `;
        const queryParams = [
            req.params.id
        ];
        const dbRes = await pool.query(queryText, queryParams);
        res.send(dbRes.rows);
    }
    catch (error) {
        console.error('error in GET /api/animal/:id');
        res.sendStatus(500);
    }
})


 router.put('/:id/training', async (req, res) => {
    try {
        // Write SQL query
        const queryText = `
        UPDATE "animals"
        SET "sitOnLeash" = $1,
        "sitOffLeash" = $2,
        "downOnLeash" = $3,
        "downOffLeash" = $4,
        "standOnLeash" = $5,
        "standOffLeash" = $6,
        "barkOnCommand" = $7,
        "holdItem" = $8,
        "mark" = $9,
        "silentCommands" = $10,
        "strangerHandle" = $11,
        "strangerDress" = $12,
        "goodAroundChildren" = $13,
        "otherDogs" = $14,
        "smallAnimals" = $15,
        "loudNoiseLights" = $16,
        "shortNotice" = $17,
        "overnight" = $18
        WHERE "id" = $19
    `;
        const queryParams = [
            req.body.sitOnLeash,
            req.body.sitOffLeash,
            req.body.downOnLeash,
            req.body.downOffLeash,
            req.body.standOnLeash,
            req.body.standOffLeash,
            req.body.barkOnCommand,
            req.body.holdItem,
            req.body.mark,
            req.body.silentCommands,
            req.body.strangerHandle,
            req.body.strangerDress,
            req.body.goodAroundChildren,
            req.body.otherDogs,
            req.body.smallAnimals,
            req.body.loudNoiseLights,
            req.body.shortNotice,
            req.body.overnight,
            req.params.id
        ];
        const response = await pool.query(queryText, queryParams);
        res.sendStatus(201);
    }
    catch (error) {
        console.error('Error in PUT /animal/id/training', error);
        res.sendStatus(500);
    }
});


router.post('/',upload.single("selectedFile"),rejectUnauthenticated, async (req, res, next) => {
    try {
        // Write SQL query
        const queryText = `
        INSERT INTO "animals"
            ("contactsId","animalType","otherTypeDetail","image","name","color","breed",
            "sex","notes","birthday","active","rating","height","weight","length","neckGirth","bellyGirth","sitOnLeash",
            "sitOffLeash","standOnLeash","standOffLeash","downOnLeash","downOffLeash","barkOnCommand","holdItem","offLeashTrained",
            "goodAroundChildren","otherDogs","smallAnimals","atDistanceFromTrainer","silentCommands","mark","loudNoiseLights","shortNotice",
            "livesClose","overnight","strangerHandle","strangerDress")
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,
            $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38)
        `;
        const queryParams = [
            req.body.contactId,
            req.body.animalType,
            req.body.otherTypeDetail,
            req.file.location,
            req.body.name,
            req.body.color,
            req.body.breed,
            req.body.sex,
            req.body.notes,
            req.body.birthday,
            req.body.active,
            req.body.rating,
            req.body.height,
            req.body.weight,
            req.body.length,
            req.body.neckGirth,
            req.body.bellyGirth,
            req.body.sitOnLeash,
            req.body.sitOffLeash,
            req.body.standOnLeash,
            req.body.standOffLeash,
            req.body.downOnLeash,
            req.body.downOffLeash,
            req.body.barkOnCommand,
            req.body.holdItem,
            req.body.offLeashTrained,
            req.body.goodAroundChildren,
            req.body.otherDogs,
            req.body.smallAnimals,
            req.body.atDistanceFromTrainer,
            req.body.silentCommands,
            req.body.mark,
            req.body.loudNoiseLights,
            req.body.shortNotice,
            req.body.livesClose,
            req.body.overnight,
            req.body.strangerHandle,
            req.body.strangerDress,
            
        ];
        
        const response = await pool.query(queryText, queryParams);
        res.sendStatus(201);
    }
    catch (error) {
        console.error('Error in POST /animal/', error);
        res.sendStatus(500);
    }
});

/**
 * PUT animal/:id -- update animal training info
 */
 
router.put('/:id/summary', rejectUnauthenticated, async (req, res) => {

    try {
        // Write SQL query
        const queryText = `
        UPDATE "animals"
        SET "animalType" = $1,
        "otherTypeDetail" = $2,
        "name" = $3,
        "color" = $4,
        "breed" = $5,
        "sex" = $6,
        "birthday" = $7,
        "active" = $8,
        "rating" = $9,
        "height" = $10,
        "weight" = $11,
        "length" = $12,
        "neckGirth" = $13,
        "bellyGirth" = $14,
        "notes" = $15
        WHERE "id" = $16
    `;
        const queryParams = [
            req.body.animalType,
            req.body.otherTypeDetail,
            req.body.name,
            req.body.color,
            req.body.breed,
            req.body.sex,
            req.body.birthday,
            req.body.active,
            req.body.rating,
            req.body.height,
            req.body.weight,
            req.body.length,
            req.body.neckGirth,
            req.body.bellyGirth,
            req.body.notes,
            req.params.id
        ];
        const response = await pool.query(queryText, queryParams);
        res.sendStatus(201);
    }
    catch (error) {
        console.error('Error in PUT /animal/id/summary', error);
        res.sendStatus(500);
    }
});

/**
 * POST Animal to job
 */
router.post('/job', rejectUnauthenticated, async (req, res) => {
    // POST animal to jobsJunction table
    console.log('******* POST /animals/job *******')
    try {
        // Write SQL query
        const queryText = `
            INSERT INTO "jobsJunction" ("animalsId", "jobId")
            VALUES ($1, $2);
        `;
        const queryParams = [
            req.body.animalId, // $1
            req.body.jobId // $2
        ];
        // Query DB and sendStatus when complete
        const dbRes = await pool.query(queryText, queryParams);
        res.sendStatus(201);
    }
    catch (error) {
        console.error('ERROR in POST /animals/job', error);
        res.sendStatus(500);
    }
});

/**
 * DELETE Animal
 */
router.delete('/:id', rejectUnauthenticated, async (req, res) => {
    // DELETE animal from database
    try {
        console.log(`******* DELETE /animals/${req.params.id} *******`);
        const queryText = `
        DELETE FROM "animals"
        WHERE "id" = $1;
    `;
        const queryParams = [req.params.id];
        // Query DB and sendStatus when complete
        const dbRes = await pool.query(queryText, queryParams);
        res.sendStatus(200);
    }
    catch (error) {
        console.error(`ERROR in DELETE /animals/${req.params.id}`, error);
        res.sendStatus(500);
    }
});

function queryGen(qFilter) {
    let paramNumber = 1;
    let sqlQuery = { // will contain sqlString, plus params
        sqlString: '',
        sqlParams: [],
    }
    switch (qFilter.hasWorked) {
        case 'all':
            sqlQuery.sqlString += ` WHERE "animals"."id" >= 0`
            break;
        case 'true':
            sqlQuery.sqlString += ` WHERE EXISTS (SELECT * FROM "auditions" WHERE "auditions"."animalsId" = "animals"."id" )`
            break;
        case 'false':
            sqlQuery.sqlString += ` WHERE NOT EXISTS (SELECT * FROM "auditions" WHERE "auditions"."animalsId" = "animals"."id" )`
            break;
        default:
            break;
    }
    switch (qFilter.isActive) {
        case 'true':
            sqlQuery.sqlString += `AND "animals"."active" = true`
            break;
        case 'false':
            sqlQuery.sqlString += `AND "animals"."active" = false`
            break;
        default:
            break;
    }
    if (qFilter.breed && qFilter.breed !== '') {
        sqlQuery.sqlString += ` AND LOWER("breed") = LOWER($${paramNumber})`;
        sqlQuery.sqlParams.push(qFilter.breed);
        paramNumber++;
    }
    if (qFilter.type && qFilter.type !== '') {
        sqlQuery.sqlString += ` AND "animalType" = $${paramNumber}`
        sqlQuery.sqlParams.push(qFilter.type);
        paramNumber++;
    }
    if (qFilter.minA && qFilter.minA !== '') {
        sqlQuery.sqlString += ` AND "date" >= $${paramNumber}`
        sqlQuery.sqlParams.push(qFilter.minA);
        paramNumber++;
    }
    if (qFilter.maxA && qFilter.maxA !== '') {
        sqlQuery.sqlString += ` AND "date" <= $${paramNumber}`
        sqlQuery.sqlParams.push(qFilter.minA);
        paramNumber++;
    }
    if (qFilter.minL && qFilter.minL !== '') {
        sqlQuery.sqlString += ` AND "length" >= $${paramNumber}`
        sqlQuery.sqlParams.push(qFilter.minL);
        paramNumber++;
    }
    if (qFilter.maxL && qFilter.maxL !== '') {
        sqlQuery.sqlString += ` AND "length" <= $${paramNumber}`
        sqlQuery.sqlParams.push(qFilter.maxL);
        paramNumber++;
    }
    if (qFilter.minH && qFilter.minH !== '') {
        sqlQuery.sqlString += ` AND "height" >= $${paramNumber}`
        sqlQuery.sqlParams.push(qFilter.minH);
        paramNumber++;
    }
    if (qFilter.maxH && qFilter.maxH !== '') {
        sqlQuery.sqlString += ` AND "height" <= $${paramNumber}`
        sqlQuery.sqlParams.push(qFilter.maxH);
        paramNumber++;
    }
    if (qFilter.minN && qFilter.minN !== '') {
        sqlQuery.sqlString += ` AND "neckGirth" >= $${paramNumber}`
        sqlQuery.sqlParams.push(qFilter.minN);
        paramNumber++;
    }
    if (qFilter.maxN && qFilter.maxN !== '') {
        sqlQuery.sqlString += ` AND "neckGirth" <= $${paramNumber}`
        sqlQuery.sqlParams.push(qFilter.maxN);
        paramNumber++;
    }
    if (qFilter.minB && qFilter.minB !== '') {
        sqlQuery.sqlString += ` AND "bellyGirth" >= $${paramNumber}`
        sqlQuery.sqlParams.push(qFilter.minB);
        paramNumber++;
    }
    if (qFilter.maxB && qFilter.maxB !== '') {
        sqlQuery.sqlString += ` AND "bellyGirth" <= $${paramNumber}`
        sqlQuery.sqlParams.push(qFilter.maxB);
        paramNumber++;
    }
    if (qFilter.minW && qFilter.minW !== '') {
        sqlQuery.sqlString += ` AND "weight" >= $${paramNumber}`
        sqlQuery.sqlParams.push(qFilter.minW);
        paramNumber++;
    }
    if (qFilter.maxW && qFilter.maxW !== '') {
        sqlQuery.sqlString += ` AND "weight" <= $${paramNumber}`
        sqlQuery.sqlParams.push(qFilter.maxW);
        paramNumber++;
    }
    return sqlQuery
}

module.exports = router;
