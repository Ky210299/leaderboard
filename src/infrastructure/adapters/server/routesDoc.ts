/**
 * @swagger
 * /participant:
 *   post:
 *     summary: Create a new participant
 *     description: Allows creating a participant by providing a unique `id` and a `name`.
 *     tags:
 *       - Participant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Unique identifier for the participant.
 *               name:
 *                 type: string
 *                 description: Name of the participant.
 *             required:
 *               - id
 *               - name
 *             example:
 *               id: "participant-123"
 *               name: "John Doe"
 *     responses:
 *       201:
 *         description: Participant successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error details.
 */

/**
 * @swagger
 * /participants:
 *   get:
 *     summary: Retrieve all participants
 *     description: Fetch a list of all participants.
 *     tags:
 *       - Participant
 *     responses:
 *       200:
 *         description: List of participants.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 */

/**
 * @swagger
 * /leaderboard/{activityId}:
 *   get:
 *     summary: Retrieve the leaderboard for a specific activity
 *     description: Fetch the leaderboard associated with a specific activity by its ID.
 *     tags:
 *       - Leaderboard
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the activity.
 *     responses:
 *       200:
 *         description: Leaderboard successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid request data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid data"
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Retrieve all activities
 *     description: Fetch a list of all activities.
 *     tags:
 *       - Activity
 *     responses:
 *       200:
 *         description: List of activities.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /participant/{participantId}:
 *   patch:
 *     summary: Update participant details
 *     description: Allows updating a participant's `id` and/or `name` using their unique identifier.
 *     tags:
 *       - Participant
 *     parameters:
 *       - in: path
 *         name: participantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the participant to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: New ID for the participant (optional).
 *               name:
 *                 type: string
 *                 description: New name for the participant (optional).
 *             example:
 *               id: "new-id-123"
 *               name: "Jane Doe"
 *     responses:
 *       200:
 *         description: Participant successfully updated.
 *       204:
 *         description: No data provided for update.
 *       400:
 *         description: Invalid participant ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /participant/{participantId}/score:
 *   patch:
 *     summary: Update participant's score for an activity
 *     description: Modify a participant's score using different methods: add, subtract. If the activity is new for the participant, they will be required to send the title and initial score.
 *     tags:
 *       - Score
 *     parameters:
 *       - in: path
 *         name: participantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the participant.
 *       - in: query
 *         name: method
 *         required: true
 *         schema:
 *           type: string
 *           enum: [add, subtract, set]
 *         description: Method for updating the score.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activity:
 *                 type: object
 *                 required: [id]
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Activity ID.
 *                   title:
 *                     type: string
 *                     description: Optional activity title.
 *                   initialScore:
 *                     type: number
 *                     description: Initial score for the activity.
 *               score:
 *                 type: number
 *                 description: Score value to add, subtract, or set.
 *             example:
 *               activity:
 *                 id: "activity-123"
 *                 title: "Quiz"
 *               score: 50
 *     responses:
 *       200:
 *         description: Score successfully updated.
 *       400:
 *         description: Invalid data or unsupported method.
 *       500:
 *         description: Internal server error.
 */
