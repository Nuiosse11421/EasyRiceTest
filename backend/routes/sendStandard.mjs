import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url)
const __dirPath = path.dirname(__filename)

//Read file
router.get('/standard', (req, res) => {
    const filePath = path.join(__dirPath, '../data/standards.json')
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading standdards.json: ', err)
            return res.status(500).json({ error: 'Failed to load data' });
        }
        const standards = JSON.parse(data);
        res.json({ data: standards })
    })
})

export default router