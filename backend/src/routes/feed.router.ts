import { Router } from 'express';
import { addNewFeed, deleteFeedById, editFeedContent, getFeedsPaginated } from '../controllers/feeds.controller';
import { verifyToken } from '../middleware/verifytoken';
import { isFilledContent, validateFeedParam, validateParamId } from '../middleware/validateinput';

const feedRouter = Router();
/**
 * @openapi
 * /feed:
 *   get:
 *     summary: Fetch paginated list of feeds
 *     tags:
 *       - Feed
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of feeds to fetch per page (default is 10)
 *         schema:
 *           type: integer
 *       - name: cursor
 *         in: query
 *         required: false
 *         description: Cursor for pagination to fetch the next set of feeds
 *         schema:
 *           type: integer
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Feeds fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 body:
 *                   type: object
 *                   properties:
 *                     cursor:
 *                       type: integer
 *                       nullable: true
 *                     feeds:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           content:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           author:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                               profile_photo:
 *                                 type: string
 *       401:
 *         description: User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 */

feedRouter.get('/feed', verifyToken, validateFeedParam, getFeedsPaginated);

/**
 * @openapi
 * /feed:
 *   post:
 *     summary: Create a new feed
 *     tags:
 *       - Feed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: > 
 *                  The content of the feed (max length: 280 characters)
 *                 example: "This is a sample feed content."
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Feed created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     content:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     authorId:
 *                       type: integer
 *       400:
 *         description: Bad request, such as content exceeding 280 characters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         description: User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 */
feedRouter.post('/feed', verifyToken, isFilledContent, addNewFeed);

/**
 * @openapi
 * /feed/{id}:
 *   put:
 *     summary: Edit an existing feed's content
 *     tags:
 *       - Feed
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the feed to be edited
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: >
 *                  Updated content for the feed (max length: 280 characters).
 *                 example: "This is the updated feed content."
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Feed edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     content:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Missing or invalid parameter (e.g., missing `id`, invalid `id`, or empty content)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       401:
 *         description: User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       403:
 *         description: User does not have permission to edit this feed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 */

feedRouter.put('/feed/:id', verifyToken, validateParamId, isFilledContent, editFeedContent);

/**
 * @openapi
 * /feed/{id}:
 *   delete:
 *     summary: Delete an existing feed
 *     tags:
 *       - Feed
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the feed to be deleted
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Feed deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   nullable: true
 *       401:
 *         description: User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       403:
 *         description: User does not have permission to delete this feed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 */
feedRouter.delete('/feed/:id', verifyToken, validateParamId, deleteFeedById);

export default feedRouter;