import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model';
import { Video } from '../models/video.model';

// Ensure the .env variables are loaded
dotenv.config({ path: './.env' });

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in the .env file");
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected for seeding...");

    // --- WIPE ALL EXISTING DATA ---
    await User.deleteMany({});
    await Video.deleteMany({});
    console.log("Cleared existing users and videos.");

    // --- CREATE 5 NEW USERS ---
    const users = await User.create([
      { username: 'techguru', email: 'tech@example.com', password: 'password123' },
      { username: 'cinemabuff', email: 'cinema@example.com', password: 'password123' },
      { username: 'musicmaestro', email: 'music@example.com', password: 'password123' },
      { username: 'sportsfanatic', email: 'sports@example.com', password: 'password123' },
      { username: 'webseriesfan', email: 'webseries@example.com', password: 'password123' },
    ]);
    console.log(`${users.length} users created.`);
    const [techUser, cinemaUser, musicUser, sportsUser, webseriesUser] = users;

    // --- DEFINE RAW VIDEO DATA (NO DUPLICATES) ---
    const videosData = [
      // Tech (10 Videos)
      { youtubeVideoId: 'RGOj5yH7evk', title: "Git and GitHUB", uploaderId: techUser._id, category: "Tech", price: 499 },
      { youtubeVideoId: 'Gv9_4yMHFhI', title: "Introduction to ML", uploaderId: techUser._id, category: "Tech", price: 299 },
      { youtubeVideoId: 'HXV3zeQKqGY', title: "SQL Full course", uploaderId: techUser._id, category: "Tech", price: 199 },
      { youtubeVideoId: 'Ke90Tje7VS0', title: "JavaScript for Beginners", uploaderId: techUser._id, category: "Tech", price: 599 },
      //{ youtubeVideoId: 'H_2E01yA3eI', title: "The Quantum Computing Race", uploaderId: techUser._id, category: "Tech", price: 399 },
      { youtubeVideoId: 'ofme2o29ngU', title: "MongoDB", uploaderId: techUser._id, category: "Tech", price: 799 },
     // { youtubeVideoId: 'bbk_wDeIu_Y', title: "Node.js & Express Full Course", uploaderId: techUser._id, category: "Tech", price: 699 },
      { youtubeVideoId: 'w7ejDZ8SWv8', title: "Figma UI/UX Design Tutorial", uploaderId: techUser._id, category: "Tech", price: 499 },
      { youtubeVideoId: 'PkZNo7MFNFg', title: "Python for Data Science", uploaderId: techUser._id, category: "Tech", price: 899 },
      { youtubeVideoId: 'G3e-cpL7ofc', title: "The M1 Chip Explained", uploaderId: techUser._id, category: "Tech", price: 299 },

      // Movie Trailers (11 Videos)
      { youtubeVideoId: 'XJMuhwVlca4', title: "Mad Max | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 99 },
      { youtubeVideoId: '6JnN1DmbqoU', title: "Dune: Part Two | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 99 },
      { youtubeVideoId: 'qEVUtrk8_B4', title: "Johm Wick | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 149 },
      { youtubeVideoId: 'U2Qp5pL3ovA', title: "Joker: Folie à Deux | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 149 },
      { youtubeVideoId: 'mqqft2x_Aa4', title: "PankajMan | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 129 },
      { youtubeVideoId: 'GY4BgdUSpbE', title: "RRR | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 129 },
      { youtubeVideoId: 'shW9i6k8cB0', title: "Spider Man | Teaser", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 149 },
      { youtubeVideoId: 'COv52Qyctws', title: "Jawan | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 129 },
     // { youtubeVideoId: 'SqcY0GlETPk', title: "Leo | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 129 },
      { youtubeVideoId: '1F3hm6MfR1k', title: "Jailer | Official Showcase", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 129 },
      { youtubeVideoId: 'Po3jStA673E', title: "KGF Chapter 2 | Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 129 },
      
      // Webseries Clips (10 Videos)
      { youtubeVideoId: 'uLtkt8BonwM', title: "The last of Us | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 199 },
      { youtubeVideoId: 'Znsa4Deavgg', title: "Mouse Man | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 199 },
      { youtubeVideoId: 'rlR4PJn8b8I', title: "Game of THrones | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 249 },
      { youtubeVideoId: 'fXmAurh012s', title: "Arcane | Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 249 },
      { youtubeVideoId: 'JWtnJjn6ng0', title: "Crown | Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 249 },
      { youtubeVideoId: 'JtqIas3bYhg', title: "NSFW | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 199 },
      { youtubeVideoId: 'oZn3qSgmLqI', title: "Queen Season 2 | Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 199 },
      { youtubeVideoId: '3u7EIiohs6U', title: "lasso | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 249 },
      { youtubeVideoId: 'sj9J2ecsSpo', title: "Wanda | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 249 },
      //{ youtubeVideoId: 'Vp_n_3aEaWk', title: "Gullak Season 3 | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 199 },

      // Sports (10 Videos)
      { youtubeVideoId: '4psQZaPTq9M', title: "Archery", uploaderId: sportsUser._id, category: "Sports", price: 249 },
      { youtubeVideoId: 'BEG-ly9tQGk', title: "Top 10 shots", uploaderId: sportsUser._id, category: "Sports", price: 199 },
     // { youtubeVideoId: '5nGuHk-4a_8', title: "Mens individual", uploaderId: sportsUser._id, category: "Sports", price: 399 },
      { youtubeVideoId: 'eoeIl02oH90', title: "ParaOlymics", uploaderId: sportsUser._id, category: "Sports", price: 299 },
      { youtubeVideoId: 'CgVla97UTPM', title: "Not a good Archer", uploaderId: sportsUser._id, category: "Sports", price: 349 },
      { youtubeVideoId: 'cAOThfPwZf4', title: "Lady Archer", uploaderId: sportsUser._id, category: "Sports", price: 199 },
      { youtubeVideoId: 'vThUhQZyWj0', title: "Fix Accuray", uploaderId: sportsUser._id, category: "Sports", price: 299 },
      { youtubeVideoId: 'EWLaHqqnf-E', title: "Speed", uploaderId: sportsUser._id, category: "Sports", price: 249 },
      { youtubeVideoId: 'rqVIyjOe4iQ', title: "BestHunter", uploaderId: sportsUser._id, category: "Sports", price: 199 },
      //{ youtubeVideoId: 'L2u9yS4s9gY', title: "History of the FIFA World Cup", uploaderId: sportsUser._id, category: "Sports", price: 399 },

      // Hindi Music (10 Videos)
      { youtubeVideoId: 'i96UO8-GFvw', title: "Aaoge tum kabhi | Pritam", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'sFMRqxCexDk', title: "Choo lo", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'U2SVCCENLjE', title: "CO2", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'pRLOXUlIUG0', title: "Mulaquat", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'iOIF74Hk80A', title: "Kasoor", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'ilNt2bikxDI', title: "Jo tum mero Ho", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'gJLVTKhTnog', title: "Husn", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: '2FhgKp_lfJQ', title: "Afsos", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: '6BYIKEH0RCQ', title: "Lizzi", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: '97NWNz9kgxU', title: "Jeet", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
    ];

    // --- PROCESS AND INSERT ALL VIDEOS ---
    const videos = videosData.map(v => ({
        ...v,
        description: `Watch the premium video: ${v.title}. Purchase now for exclusive access. A must-watch in the ${v.category} category.`,
        thumbnailUrl: `https://i.ytimg.com/vi/${v.youtubeVideoId}/maxresdefault.jpg`,
        duration: Math.floor(Math.random() * 4000) + 600, // Random duration between 10-76 mins
        views: Math.floor(Math.random() * 150000) + 100000,
       // likes: Math.floor(Math.random() * 100) + 1000,
        monetization: {
            type: 'premium',
            // Rent price is 40% of buy price, with a minimum of 49
            price: { rent: Math.max(49, Math.floor(v.price * 0.4)), buy: v.price }
        },
    }));

    await Video.insertMany(videos);
    console.log(`${videos.length} videos created.`);
    console.log("✅ Database has been successfully seeded with a rich dataset!");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
