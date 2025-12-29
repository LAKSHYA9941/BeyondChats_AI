import { Router, Request, Response } from 'express';
import Blog, { IBlogPost } from '../models/blog.model.js';
import isValidObjectId from '../helper/isvalidid.js';

const router = Router();

// ==========================================
// GET /api/blogs - Get all blogs
// ==========================================
/**
 * @route   GET /api/blogs
 * @desc    Get all blog posts with optional pagination and filtering
 * @access  Public
 * @query   page, limit, category, search
 * @example GET /api/blogs?page=1&limit=10&category=AI&search=chatbot
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const category = req.query.category as string;
        const search = req.query.search as string;

        const filter: any = {};
        
        if (category) {
            filter.category = category;
        }
        
        if (search) {
            filter.$text = { $search: search };
        }

        const skip = (page - 1) * limit;
        const blogs = await Blog.find(filter)
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Blog.countDocuments(filter);

        return res.status(200).json({
            success: true,
            data: blogs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        console.error('Error fetching blogs:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching blogs',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// ==========================================
// GET /api/blogs/:id - Get single blog by ID
// ==========================================
/**
 * @route   GET /api/blogs/:id
 * @desc    Get a single blog post by ID
 * @access  Public
 * @example GET /api/blogs/507f1f77bcf86cd799439011
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid blog ID format'
            });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: `Blog not found with ID: ${id}`
            });
        }

        return res.status(200).json({
            success: true,
            data: blog
        });

    } catch (error: any) {
        console.error('Error fetching blog:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching blog',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// ==========================================
// POST /api/blogs - Create new blog
// ==========================================
/**
 * @route   POST /api/blogs
 * @desc    Create a new blog post
 * @access  Public (should be protected in production)
 * @body    { title, url, author, date, excerpt, category, originalContent }
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const newBlog = new Blog(req.body);
        await newBlog.save();
        
        return res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: newBlog
        });

    } catch (error: any) {
        console.error('Error creating blog:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Blog with this URL already exists'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error while creating blog',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// ==========================================
// PUT /api/blogs/:id - Update blog
// ==========================================
/**
 * @route   PUT /api/blogs/:id
 * @desc    Update an existing blog post
 * @access  Public (should be protected in production)
 * @body    Any blog fields to update
 */
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid blog ID format'
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({
                success: false,
                message: `Blog not found with ID: ${id}`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: updatedBlog
        });

    } catch (error: any) {
        console.error('Error updating blog:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error while updating blog',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// ==========================================
// DELETE /api/blogs/:id - Delete blog
// ==========================================
/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete a blog post
 * @access  Public (should be protected in production)
 */
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid blog ID format'
            });
        }

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({
                success: false,
                message: `Blog not found with ID: ${id}`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
            data: deletedBlog
        });

    } catch (error: any) {
        console.error('Error deleting blog:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting blog',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;