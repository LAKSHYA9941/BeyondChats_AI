import mongoose, { Schema, Document } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export interface IBlogPost extends Document {
    title: string;
    originalContent: string;
    updatedContent: string;
    sources: string[];
    aiModel: string;
    improvedAt: Date;
    improvementScore: number;
    url: string;
    author: string;
    date: string;
    excerpt: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;
}

const blogSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    originalContent: {
        type: String,
        required: [true, 'Original content is required']
    },
    updatedContent: {
        type: String,
        default: ''
    },
    sources: [{
        type: String,
        validate: {
            validator: function(v: string) {
                return /^https?:\/\/\S+$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid URL!`
        }
    }],
    aiModel: {
        type: String,
        default: 'gpt-4o-mini',
        enum: ['gpt-4o-mini', 'gpt-4.1', 'gpt-4', 'gpt-3.5-turbo', 'claude-2', 'other']
    },
    improvedAt: {
        type: Date,
        default: Date.now
    },
    improvementScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    url: {
        type: String,
        required: [true, 'URL is required'],
        unique: true,
        validate: {
            validator: function(v: string) {
                return /^https?:\/\/\S+$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid URL!`
        }
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true
    },
    date: {
        type: String,
        required: [true, 'Publish date is required']
    },
    excerpt: {
        type: String,
        required: [true, 'Excerpt is required']
    },
    category: {
        type: String,
        default: 'Uncategorized'
    }
}, {
    timestamps: true,  // Adds createdAt and updatedAt timestamps
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add text index for search functionality
blogSchema.index({ 
    title: 'text', 
    originalContent: 'text', 
    updatedContent: 'text',
    excerpt: 'text'
});


const Blog = mongoose.model<IBlogPost>('Blog', blogSchema);

export default Blog;