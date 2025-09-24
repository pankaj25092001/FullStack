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
      { youtubeVideoId: 'u31fed_224s', title: "Oppenheimer | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 99 },
      { youtubeVideoId: '6JnN1DmbqoU', title: "Dune: Part Two | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 99 },
      { youtubeVideoId: 'qEVUtrk8_B4', title: "Johm Wick | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 149 },
      { youtubeVideoId: 'U2Qp5pL3ovA', title: "Joker: Folie à Deux | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 149 },
      { youtubeVideoId: 'fhr3M5_d3sE', title: "Brahmastra | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 129 },
      { youtubeVideoId: 'GY4BgdUSpbE', title: "RRR | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 129 },
      { youtubeVideoId: 'he_m2-K_m_k', title: "Pushpa 2: The Rule | Teaser", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 149 },
      { youtubeVideoId: 'COv52Qyctws', title: "Jawan | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 129 },
      { youtubeVideoId: 'SqcY0GlETPk', title: "Leo | Official Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 129 },
      { youtubeVideoId: '1F3hm6MfR1k', title: "Jailer | Official Showcase", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 129 },
      { youtubeVideoId: 'Po3jStA673E', title: "KGF Chapter 2 | Trailer", uploaderId: cinemaUser._id, category: "Movie Trailer", price: 129 },
      
      // Webseries Clips (10 Videos)
      { youtubeVideoId: 'xmyEbx2j_o0', title: "Mirzapur Season 3 | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 199 },
      { youtubeVideoId: 'MeiGJu_2-F0', title: "Panchayat Season 3 | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 199 },
      { youtubeVideoId: '72h2yP9cW8c', title: "Scam 1992 | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 249 },
      { youtubeVideoId: 'X6Uj5k5_E_A', title: "The Family Man Season 2 | Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 249 },
      { youtubeVideoId: 'DevY1KxQeF4', title: "Sacred Games Season 2 | Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 249 },
      { youtubeVideoId: 'gf0oO4v2-f4', title: "Aspirants | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 199 },
      { youtubeVideoId: 'YhEw22GvI3I', title: "Kota Factory Season 2 | Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 199 },
      { youtubeVideoId: 'z32sMLs-4yI', title: "Paatal Lok | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 249 },
      { youtubeVideoId: '83q1eT--a1k', title: "Special OPS 1.5 | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 249 },
      { youtubeVideoId: 'Vp_n_3aEaWk', title: "Gullak Season 3 | Official Trailer", uploaderId: webseriesUser._id, category: "Webseries Clips", price: 199 },

      // Sports (10 Videos)
      { youtubeVideoId: 'F46_2d_eL68', title: "India vs Pakistan T20 World Cup Highlights", uploaderId: sportsUser._id, category: "Sports", price: 249 },
      { youtubeVideoId: 'yrMee02-wS0', title: "Top 10 Goals of the Season 23/24", uploaderId: sportsUser._id, category: "Sports", price: 199 },
      { youtubeVideoId: '5nGuHk-4a_8', title: "MS Dhoni's World Cup Winning Six", uploaderId: sportsUser._id, category: "Sports", price: 399 },
      { youtubeVideoId: 'yIzb3xA0G5A', title: "Virat Kohli's Masterclass vs Pakistan", uploaderId: sportsUser._id, category: "Sports", price: 299 },
      { youtubeVideoId: 'OkK-y9R-a-I', title: "Neeraj Chopra Olympic Gold Medal Throw", uploaderId: sportsUser._id, category: "Sports", price: 349 },
      { youtubeVideoId: 'Cmr-244IFGA', title: "Top 10 F1 Moments of the Decade", uploaderId: sportsUser._id, category: "Sports", price: 199 },
      { youtubeVideoId: 'ESxSaD_iZtM', title: "The Miracle at Istanbul 2005", uploaderId: sportsUser._id, category: "Sports", price: 299 },
      { youtubeVideoId: 'O71-eDk-B2Q', title: "Best of NBA Finals 2024", uploaderId: sportsUser._id, category: "Sports", price: 249 },
      { youtubeVideoId: 'xP83j-PAk0k', title: "Best Cricket Catches of All Time", uploaderId: sportsUser._id, category: "Sports", price: 199 },
      { youtubeVideoId: 'L2u9yS4s9gY', title: "History of the FIFA World Cup", uploaderId: sportsUser._id, category: "Sports", price: 399 },

      // Hindi Music (10 Videos)
      { youtubeVideoId: 'Y9PZE8-K_NU', title: "Kesariya - Brahmastra | Pritam", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: '8m5-ar_wwG4', title: "Guli Mata - Saad Lamjarred & Shreya Ghoshal", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'huxhK_gVa20', title: "Pasoori Nu - Satyaprem Ki Katha", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'vgm1u2gPx24', title: "O Maahi - Dunki | Pritam", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'BddP6PYo2gs', title: "Chaleya - Jawan | Anirudh", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'E2W4AAzS8gI', title: "Apna Bana Le - Bhediya", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'u2-pc1I4gC0', title: "Satranga - Animal | Arijit Singh", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'sa9l_2zq1kA', title: "Heeriye - Jasleen Royal ft. Arijit Singh", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'z-sAqQoHkeA', title: "Tere Vaaste - Zara Hatke Zara Bachke", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
      { youtubeVideoId: 'd9MyW72ELq0', title: "Le Le Ram Ram - Pritam", uploaderId: musicUser._id, category: "Hindi Music", price: 49 },
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
