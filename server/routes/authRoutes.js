import express from 'express';
import { fetchLinkAccounts, linkAccount } from '../controllers/authController.js';

const route = express.Router();

route.post('/link-account',linkAccount);
route.get('/fetch-link-account', fetchLinkAccounts);

export default route;