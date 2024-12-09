import { Request, Response } from 'express';
import * as feedsService from '../services/feed.service';
import jwt from 'jsonwebtoken';
import '../utils/bigIntUtils';

export const getFeedsPaginated = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
              success: false,
              message: "You are not authenticated",
              error: null,
            });
          }
        const limit = parseInt(req.query.limit) || 10;
        const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
        const userId = req.user.userId;

        const { feeds, nextCursor } = await feedsService.getPaginatedFeeds({ limit, cursor, userId });

        return res.status(200).json({
            success: true,
            message: "Feeds fetched successfully",
            body: {
                cursor: nextCursor || null,
                feeds: feeds || [],
            }
        });
    } catch (e) {
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "Something went wrong while fetching feeds"
        })
    }
}

export const addNewFeed = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "You're not authenticated, log in to continue",
                error: null,
            })
        }
        
        const { content } = req.body;
        const { userId } = req.user;
        
        if (content.length > 280) {
            return res.status(400).json({
              success: false,
              message: "Content exceeds maximum length of 280 characters",
              error: null,
            });
        }

        const newfeed = await feedsService.insertNewFeed(content, userId);

        return res.status(200).json({
            success: true,
            message: "Feed created successfully",
            data: newfeed,
        });
    } catch (e) {
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "Something went wrong while inserting feeds"
        })
    }
}

export const editFeedContent = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "You're not authenticated, log in to continue",
                error: null,
            })
        }
        
        const feedId = req.params.id;
        const { content } = req.body;
        const { userId } = req.user;
        const isOwner = await feedsService.isOwnerFeed(feedId, userId);
        if (!isOwner) {
            return res.status(403).json({
                success: true,
                message: "You're not allowed to access this resource",
                data: null,
            });
        }

        const editFeed = await feedsService.editFeed(content, feedId);

        return res.status(200).json({
            success: true,
            message: "Feed edited successfully",
            data: editFeed,
        });
    } catch (e) {
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "Something went wrong while editing feeds"
        })
    }
}

export const deleteFeedById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "You're not authenticated, log in to continue",
                error: null,
            })
        }

        const feedId = req.params.id;
        const { userId } = req.user;

        const isOwner = await feedsService.isOwnerFeed(feedId, userId);
        if (!isOwner) {
            return res.status(403).json({
                success: true,
                message: "You're not allowed to access this resource",
                data: null,
            });
        }

        const editFeed = await feedsService.deleteFeed(feedId);

        return res.status(200).json({
            success: true,
            message: "Feed deleted successfully",
            data: editFeed,
        });
    } catch (e) {
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "Something went wrong while deleting feeds"
        })
    }
}