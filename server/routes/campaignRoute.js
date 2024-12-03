import express from 'express';
import { addCampaign, getAllCampaigns } from '../controllers/campaignController.js';

const route = express.Router();

route.get('/get-campaign', getAllCampaigns);
route.post('/add', addCampaign);

export default route;