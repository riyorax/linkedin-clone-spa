import { Request, Response } from 'express';
import * as feedsService from '../services/feed.service';
import jwt from 'jsonwebtoken';
import '../utils/bigIntUtils';

export const getFeedsPaginated = async (req, res) => {
    try{
        const limit = parseInt(req.query.limit) || 10;
        const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
        const userId = req.user.userId;

        const feeds = await feedsService.getPaginatedFeeds({limit, cursor, userId});

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

export const editFeedContent = async (req, res) => {
    try{
        const feedId = req.params.id;
        const { content } = req.body;
        const { userId } = req.user;
        const isOwner = await feedsService.isOwnerFeed(feedId, userId);
        if(!isOwner){
            return res.status(403).json({
                success: true,
                message: "Feed edited successfully",
                data: null,
            });
        }
        
        const editFeed = await feedsService.editFeed(content, feedId);

        return res.status(200).json({
            success: true,
            message: "Feed edited successfully",
            data: editFeed,
        });
    }catch (e){
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "Something went wrong while editing feeds"
        })
    }
}

export const deleteFeedById = async (req, res) => {
    try{
        const feedId = req.params.id;
        const { userId } = req.user;

        const isOwner = await feedsService.isOwnerFeed(feedId, userId);
        if(!isOwner){
            return res.status(403).json({
                success: true,
                message: "Feed edited successfully",
                data: null,
            });
        }
        
        const editFeed = await feedsService.deleteFeed(feedId);

        return res.status(200).json({
            success: true,
            message: "Feed deleted successfully",
            data: editFeed,
        });
    }catch (e){
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "Something went wrong while deleting feeds"
        })
    }
}