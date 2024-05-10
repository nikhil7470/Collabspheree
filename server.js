// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const session = require('express-session');
// const MongoDBSessionStore = require('connect-mongodb-session')(session);
// const multer = require('multer');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // MongoDB connection
// const connectionString = 'mongodb+srv://myfreefirelive:b0ygr1lpuqXOcu7S@firstgame.ifarrlu.mongodb.net/?retryWrites=true&w=majority&appName=firstGame';

// mongoose.connect(connectionString, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch((err) => {
//     console.error('Failed to connect to MongoDB:', err);
// });

// // Define schema and models
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
// });

// const User = mongoose.model('User', userSchema);

// const postSchema = new Schema({
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     photo: { type: String } // Path to the uploaded photo
// });

// // Brand dashboard schema
// const BrandDashboardSchema = new mongoose.Schema({
//     brandName: String,
//     followersCount: Number,
//     // Add more fields as needed
// });

// // Brand post schema
// const BrandPostSchema = new mongoose.Schema({
//     title: String,
//     content: String,
//     // Add more fields as needed
// });


// const Post = mongoose.model('Post', postSchema);

// // Session store
// const store = new MongoDBSessionStore({
//     uri: 'mongodb://localhost:27017/collabsphere',
//     collection: 'sessions'
// });

// // Middleware
// app.use(express.json());
// app.use(session({
//     secret: 'secretkey',
//     resave: false,
//     saveUninitialized: false,
//     store: store
// }));

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

// // Routes
// // Register user
// app.post('/register', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ email, password: hashedPassword });
//         await user.save();
//         res.json({ message: 'User registered successfully' });
//     } catch (err) {
//         console.error('Error registering user:', err);
//         res.status(500).json({ error: 'Error registering user' });
//     }
// });

// // Login user
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ error: 'Invalid email or password' });
//         }
//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword) {
//             return res.status(400).json({ error: 'Invalid email or password' });
//         }
//         req.session.userId = user._id;
//         res.json({ message: 'Logged in successfully' });
//     } catch (err) {
//         console.error('Error logging in user:', err);
//         res.status(500).json({ error: 'Error logging in user' });
//     }
// });


// // Brand dashboard model
// const BrandDashboard = mongoose.model('BrandDashboard', BrandDashboardSchema);

// // Brand post model
// const BrandPost = mongoose.model('BrandPost', BrandPostSchema);

// app.get('/brand/dashboard', async (req, res) => {
//     try {
//         const brandDashboardData = await BrandDashboard.findOne();
//         res.json(brandDashboardData);
//     } catch (error) {
//         console.error('Error fetching brand dashboard:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// app.get('/brand/posts', async (req, res) => {
//     try {
//         const brandPosts = await BrandPost.find();
//         res.json(brandPosts);
//     } catch (error) {
//         console.error('Error fetching brand posts:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// // Create post
// app.post('/posts', upload.single('photo'), async (req, res) => {
//     if (!req.session.userId) {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }
//     try {
//         const { title, content } = req.body;
//         const photo = req.file ? req.file.path : null;
//         const post = new Post({ title, content, photo });
//         await post.save();
//         res.json({ message: 'Post created successfully' });
//     } catch (err) {
//         console.error('Error creating post:', err);
//         res.status(500).json({ error: 'Error creating post' });
//     }
// });

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });
// // Serve static files
// app.use(express.static('public'));
// app.use('/uploads', express.static('uploads'));

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoDBSessionStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));

// MongoDB connection
const connectionString = 'mongodb+srv://myfreefirelive:b0ygr1lpuqXOcu7S@firstgame.ifarrlu.mongodb.net/?retryWrites=true&w=majority&appName=firstGame';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});

// Define schema and models
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    bio: { type: String },
    profilePicture: { type: String }
});

const User = mongoose.model('User', userSchema);

// Brand dashboard schema
const BrandDashboardSchema = new mongoose.Schema({
    brandName: String,
    followersCount: Number,
    // Add more fields as needed
});

// Brand post schema
const BrandPostSchema = new mongoose.Schema({
    title: String,
    content: String,
    likes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    // Add more fields as needed
});

const BrandDashboard = mongoose.model('BrandDashboard', BrandDashboardSchema);
const BrandPost = mongoose.model('BrandPost', BrandPostSchema);

// Comment schema
const CommentSchema = new mongoose.Schema({
    content: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    // Add more fields as needed
});

const Comment = mongoose.model('Comment', CommentSchema);

// Session store
const store = new MongoDBSessionStore({
    uri: 'mongodb://localhost:27017/collabsphere',
    collection: 'sessions'
});

// Middleware
app.use(express.json());
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: store
}));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
// Authentication middleware
const requireAuth = (req, res, next) => {
    // Check if user is logged in
    if (req.session.userId) {
        // Check if the request is for brand-specific routes
        if (req.baseUrl.startsWith('/brand')) {
            // Assuming the user type is stored in the session or database
            // You need to implement logic to determine if the user is a brand
            const userType = req.session.userType; // Assuming userType is stored in the session
            if (userType === 'brand') {
                // If the user is a brand, allow access to brand-specific routes
                next();
            } else {
                // If the user is not a brand, deny access
                res.status(403).json({ error: 'Forbidden' }); // Send forbidden status
            }
        } else {
            // For non-brand-specific routes, allow access
            next();
        }
    } else {
        // If user is not logged in, redirect to login page or show an error message
        res.status(401).json({ error: 'Unauthorized' });
    }
};
// Register user
app.post('/register', async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, username });
        await user.save();
        res.json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        req.session.userId = user._id;
        res.json({ message: 'Logged in successfully' });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Error logging in user' });
    }
});

// Logout user
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out user:', err);
            res.status(500).json({ error: 'Error logging out user' });
        } else {
            res.json({ message: 'Logged out successfully' });
        }
    });
});

// User profile
// Update user profile
app.put('/profile', async (req, res) => {
    const userId = req.session.userId;
    const { username, bio, profilePicture } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, { username, bio, profilePicture }, { new: true });
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Error updating profile' });
    }
});

// Get user profile
app.get('/profile', async (req, res) => {
    const userId = req.session.userId;
    try {
        const user = await User.findById(userId);
        res.json(user);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: 'Error fetching user profile' });
    }
});

// Brand dashboard
app.get('/brand/dashboard', requireAuth, async (req, res) => {
    try {
        const brandDashboardData = await BrandDashboard.findOne();
        if (!brandDashboardData) {
            // Return a default object or appropriate error message
            return res.status(404).json({ error: 'Brand dashboard data not found' });
        }
        res.json(brandDashboardData);
    } catch (error) {
        console.error('Error fetching brand dashboard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Brand posts
app.get('/brand/posts', requireAuth, async (req, res) => {
    try {
        // Additional authorization check to ensure only brands can access brand posts
        if (req.session.userType !== 'brand') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const brandPosts = await BrandPost.find().populate('comments');
        res.json(brandPosts);
    } catch (error) {
        console.error('Error fetching brand posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Create brand post
app.post('/brand/posts',requireAuth,upload.single('photo'), async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const { title, content } = req.body;
        const photo = req.file ? req.file.path : null;
        const post = new BrandPost({ title, content, photo });
        await post.save();
        res.json({ message: 'Post created successfully' });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Error creating post' });
    }
});

// Like a post
app.post('/like', async (req, res) => {
    const { postId } = req.body;
    try {
        const post = await BrandPost.findById(postId);
        post.likes += 1;
        await post.save();
        res.json({ message: 'Post liked successfully' });
    } catch (err) {
        console.error('Error liking post:', err);
        res.status(500).json({ error: 'Error liking post' });
    }
});

// Comment on a post
app.post('/comment', async (req, res) => {
    const { postId, content } = req.body;
    try {
        const userId = req.session.userId;
        const comment = new Comment({ content, user: userId });
        await comment.save();
        const post = await BrandPost.findById(postId);
        post.comments.push(comment._id);
        await post.save();
        res.json({ message: 'Comment added successfully' });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ error: 'Error adding comment' });
    }
});
app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

