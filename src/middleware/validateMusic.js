import { body, param, validationResult } from 'express-validator';

// Middleware to check validation errors
export function checkValidationResults(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
}

// ============ FOLDER VALIDATIONS ============

export const validateCreateFolder = [
  body('name')
    .trim()
    .notEmpty().withMessage('Folder name is required')
    .isLength({ min: 1, max: 255 }).withMessage('Folder name must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  checkValidationResults,
];

export const validateUpdateFolder = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('Folder name must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('isShuffle')
    .optional()
    .isBoolean().withMessage('isShuffle must be a boolean'),
  body('orderIndex')
    .optional()
    .isInt({ min: 0 }).withMessage('orderIndex must be a non-negative integer'),
  checkValidationResults,
];

export const validateFolderId = [
  param('folderId')
    .isInt().withMessage('Folder ID must be an integer'),
  checkValidationResults,
];

export const validatePlaylistId = [
  param('playlistId')
    .isInt().withMessage('Playlist ID must be an integer'),
  checkValidationResults,
];

// ============ PLAYLIST VALIDATIONS ============

export const validateCreatePlaylist = [
  body('name')
    .trim()
    .notEmpty().withMessage('Playlist name is required')
    .isLength({ min: 1, max: 255 }).withMessage('Playlist name must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean'),
  checkValidationResults,
];

export const validateUpdatePlaylist = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('Playlist name must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean'),
  checkValidationResults,
];

export const validateUserId = [
  param('userId')
    .isInt().withMessage('User ID must be an integer'),
  checkValidationResults,
];

// ============ SONG VALIDATIONS ============

export const validateCreateSong = [
  body('title')
    .trim()
    .notEmpty().withMessage('Song title is required')
    .isLength({ min: 1, max: 255 }).withMessage('Song title must be between 1 and 255 characters'),
  body('artist')
    .trim()
    .notEmpty().withMessage('Artist name is required')
    .isLength({ min: 1, max: 255 }).withMessage('Artist name must be between 1 and 255 characters'),
  body('youtubeUrl')
    .trim()
    .notEmpty().withMessage('YouTube URL is required')
    .isURL().withMessage('Invalid YouTube URL'),
  body('duration')
    .isInt({ min: 1 }).withMessage('Duration must be a positive integer (in seconds)'),
  body('thumbnail')
    .optional()
    .isURL().withMessage('Invalid thumbnail URL'),
  body('addedBy')
    .optional()
    .isInt().withMessage('addedBy must be a user ID'),
  checkValidationResults,
];

export const validateUpdateSong = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('Song title must be between 1 and 255 characters'),
  body('artist')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('Artist name must be between 1 and 255 characters'),
  body('youtubeUrl')
    .optional()
    .trim()
    .isURL().withMessage('Invalid YouTube URL'),
  body('duration')
    .optional()
    .isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('thumbnail')
    .optional()
    .isURL().withMessage('Invalid thumbnail URL'),
  checkValidationResults,
];

export const validateSongId = [
  param('songId')
    .isInt().withMessage('Song ID must be an integer'),
  checkValidationResults,
];

// ============ FOLDER SONG VALIDATIONS ============

export const validateAddSongToFolder = [
  body('songId')
    .isInt().withMessage('Song ID must be an integer'),
  body('orderIndex')
    .optional()
    .isInt({ min: 0 }).withMessage('orderIndex must be a non-negative integer'),
  checkValidationResults,
];

export const validateReorderFolderSongs = [
  body('songOrders')
    .isArray().withMessage('songOrders must be an array')
    .notEmpty().withMessage('songOrders cannot be empty'),
  body('songOrders.*.songId')
    .isInt().withMessage('Each songId must be an integer'),
  body('songOrders.*.orderIndex')
    .isInt({ min: 0 }).withMessage('Each orderIndex must be a non-negative integer'),
  checkValidationResults,
];

// ============ PLAYLIST SONG VALIDATIONS ============

export const validateAddSongToPlaylist = [
  body('songId')
    .isInt().withMessage('Song ID must be an integer'),
  body('orderIndex')
    .optional()
    .isInt({ min: 0 }).withMessage('orderIndex must be a non-negative integer'),
  checkValidationResults,
];

export const validateReorderPlaylistSongs = [
  body('songOrders')
    .isArray().withMessage('songOrders must be an array')
    .notEmpty().withMessage('songOrders cannot be empty'),
  body('songOrders.*.songId')
    .isInt().withMessage('Each songId must be an integer'),
  body('songOrders.*.orderIndex')
    .isInt({ min: 0 }).withMessage('Each orderIndex must be a non-negative integer'),
  checkValidationResults,
];

// ============ ROOM VALIDATIONS ============

export const validateCreateRoom = [
  body('name')
    .trim()
    .notEmpty().withMessage('Room name is required')
    .isLength({ min: 1, max: 255 }).withMessage('Room name must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  checkValidationResults,
];

export const validateUpdateRoom = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('Room name must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('skipVoteThreshold')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('skipVoteThreshold must be between 1 and 100'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
  body('currentSongId')
    .optional()
    .isInt().withMessage('currentSongId must be an integer'),
  checkValidationResults,
];

export const validateRoomId = [
  param('roomId')
    .isInt().withMessage('Room ID must be an integer'),
  checkValidationResults,
];

// ============ VOTE VALIDATIONS ============

export const validateAddVote = [
  body('roomId')
    .isInt().withMessage('Room ID must be an integer'),
  body('songId')
    .isInt().withMessage('Song ID must be an integer'),
  body('voteType')
    .isIn(['like', 'skip']).withMessage('Vote type must be "like" or "skip"'),
  checkValidationResults,
];

export const validateRemoveVote = [
  body('roomId')
    .isInt().withMessage('Room ID must be an integer'),
  body('songId')
    .isInt().withMessage('Song ID must be an integer'),
  body('voteType')
    .isIn(['like', 'skip']).withMessage('Vote type must be "like" or "skip"'),
  checkValidationResults,
];

// ============ DJ QUEUE VALIDATIONS ============

export const validateAddToDJQueue = [
  body('roomId')
    .isInt().withMessage('Room ID must be an integer'),
  body('playlistId')
    .optional()
    .isInt().withMessage('Playlist ID must be an integer'),
  checkValidationResults,
];
