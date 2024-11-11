import express from 'express';
import historyModels from '../models/historyModels.mjs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function loadJSON(filePath) {
    const absolutedPath = path.join(__dirname, filePath)
    return JSON.parse(fs.readFileSync(absolutedPath, 'utf-8'))
}

function isStandard(grain, subStandard) {
    const { length, shape } = grain;
    const { minLength, maxLength, conditionMin, conditionMax, shape: allowedShapes } = subStandard;

    const MinCondition = (conditionMin === 'GT' && length > minLength) || (conditionMin === 'GE' && length >= minLength);
    const MaxCondition = (conditionMax === 'LT' && length < maxLength) || (conditionMax === 'LE' && length <= maxLength);
    const shapeAllow = allowedShapes.includes(shape);

    return MinCondition && MaxCondition && shapeAllow;
}

function categorizeGrains(grains, standards) {
    const categorized = {};
    grains.forEach(grain => {
        for (const standard of standards) {
            for (const subStandard of standard.standardData) {
                if (isStandard(grain, subStandard)) {
                    const key = subStandard.key;
                    if (!categorized[key]) {
                        categorized[key] = { count: 0, weight: 0 };
                    }
                    categorized[key].count += 1;
                    categorized[key].weight += grain.weight;
                    break;
                }
            }
        }
    })
    return categorized
}

function calculate(results, totalWeight) {
    const percentages = {};
    for (const [key, { weight }] of Object.entries(results)) {
        percentages[key] = (weight / totalWeight) * 100;
    }
    return percentages;
}
router.post('/history', upload.single('file'), async (req, res) => {
    try {
        const inspectionID = uuidv4();
        const createDate = req.body.samplingDate
        const ImageLink = "https://easyrice-es-trade-data.s3.ap-southeast-1.amazonaws.com/example-rice.webp";
        const {
            name,
            standardID,
            note,
            samplingDate,
            samplingPoint,
            price,
        } = req.body;

        const fileLink = req.file ? `uploads/${req.file.filename}` : null;

        const standards = loadJSON('../data/standards.json');
        const raw = loadJSON('../data/raw.json');

        const categorizedResults = categorizeGrains(raw.grains, standards);
        const totalWeight = raw.grains.reduce((sum, grain) => sum + grain.weight, 0);
        const perentageResults = calculate(categorizedResults, totalWeight);

        const standardData = standards.flatMap((standard) =>
            standard.standardData.map((subStandard) => ({
                ...subStandard,
                value: perentageResults[subStandard.key] || 0, // ตั้งค่า value จาก percentageResults
            }))
        );

        const standard = standards.find(s => s.id === standardID);
        const standardName = standard?.name;

        const newHistory = new historyModels({
            name,
            createDate: new Date(),
            imageLink: 'https://easyrice-es-trade-data.s3.ap-southeast-1.amazonaws.com/example-rice.webp',
            inspectionID,
            standardID,
            note,
            standardName,
            samplingDate: new Date(samplingDate),
            samplingPoint,
            price,
            standardData,
        })
        await newHistory.save();
        res.status(200).json({ message: 'Inspection data saved', data: newHistory })
    } catch (err) {
        console.error('Error to get file error is: ', err.message)
        res.status(500).json({ message: 'Error to saving : ', error: err.message });
    }
})


router.get('/history', async (req, res) => {
    const { page = 1, serchId = '', formDate = '', toDate = '' } = req.query;
    const limit = 10
    const skip = (page - 1) * limit
    try {
        const query = {};
        if (serchId) {
            query.inspectionID = { $regex: searchId, $option: '1' };
        }
        if (formDate && toDate) {
            query.createDate = { $gte: new Date(formDate), $lte: new Date(toDate) };
        }
        const history = await historyModels.find(query).skip(skip).limit(limit).exec();
        const totalCount = await historyModels.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);
        res.json({ history, totalPages })
    } catch (err) {
        console.error('Error getching history: ', err.message);
        res.status(500).json({ message: 'Error fetching history', error: err.message })
    }
});

router.get('/history/:inspectionID', async (req, res) => {
    const { inspectionID } = req.params;
    try {
        // ดึงข้อมูลจาก database โดยใช้ inspectionID
        const result = await historyModels.findOne({ inspectionID });

        if (!result) {
            return res.status(404).json({ message: 'Inspection not found' });
        }

        res.json(result);
    } catch (err) {
        console.error('Error fetching result:', err);
        res.status(500).json({ message: 'Error fetching result', error: err.message });
    }
})
router.put('/history/:inspectionID', async (req, res) => {
    const { inspectionID } = req.params;
    const { note, price, samplingDate, samplingPoint } = req.body;

    try {
        // ค้นหาและอัปเดตข้อมูลตาม inspectionID
        const updatedHistory = await historyModels.findOneAndUpdate(
            { inspectionID },
            {
                note,
                price,
                samplingDate: samplingDate ? new Date(samplingDate) : undefined,
                samplingPoint
            },
            { new: true } // ส่งคืนข้อมูลที่อัปเดตล่าสุด
        );

        if (!updatedHistory) {
            return res.status(404).json({ message: 'Inspection not found' });
        }

        res.status(200).json({ message: 'Inspection updated successfully', data: updatedHistory });
    } catch (err) {
        console.error('Error updating inspection:', err);
        res.status(500).json({ message: 'Error updating inspection', error: err.message });
    }
});

//history delete
router.delete('/history/:inspectionID',async (req,res)=>{
    const {inspectionID} = req.params;
    try{
        const result =  await historyModels.deleteOne({inspectionID});

        if(result.deleteCount === 0){
            return res.status(404).json({message: 'Inspection not found'});
        }
        res.status(200).json({message:'Inspection deleted sucessfully'})
    }catch(err){
        console.error("Error to delete inspection: ",err.message);
        res.status(500).json({message: 'Error to delete inspection'})
    }
})
export default router