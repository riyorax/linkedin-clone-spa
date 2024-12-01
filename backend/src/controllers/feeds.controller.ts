import { Request, Response } from 'express';
import * as feedsService from '../services/feed.service';
import jwt from 'jsonwebtoken';
import '../utils/bigIntUtils';

export const getFeedsPaginated = async (req, res) => {
    try{
        const limit = parseInt(req.query.limit) || 10;
        const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;

        const feeds = await feedsService.getPaginatedFeeds({limit, cursor});

        return res.status(200).json({
            data: feeds,
        })
    }catch (e){
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "Something went wrong while fetching feeds"
        })
    }
}

export const addNewFeed = async (req,res) => {
    try{
        const { content } = req.body;
        const { userId } = req.user;

        const newfeed = await feedsService.insertNewFeed(content, userId);

        return res.status(200).json({
            success: true,
            message: "Feed created successfully",
            data: newfeed,
        });
    }catch (e){
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "Something went wrong while inserting feeds"
        })
    }
}