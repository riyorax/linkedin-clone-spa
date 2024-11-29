import { Request, Response } from 'express';
import * as feedsService from '../services/feed.service';
import jwt from 'jsonwebtoken';
import '../utils/bigIntUtils';

export const getFeedsPaginated = async (req, res) => {
    try{
        const { offset = 0 } = req.query
        const feeds = await feedsService.getPaginatedFeeds(offset);

        res.status(200).json({
            data: feeds,
        })
    }catch (e){
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "Something went wrong while fetching feeds"
        })
    }
}