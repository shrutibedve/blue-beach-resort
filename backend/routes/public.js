const router = require('express').Router();

const landingData = {
    gallery: [
        { id: 1, title: 'Resort Overview', img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', span: 'col-span-12 md:col-span-8 row-span-2' },
        { id: 2, title: 'Ocean Views', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', span: 'col-span-12 md:col-span-4' },
        { id: 3, title: 'Luxury Interiors', img: 'https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', span: 'col-span-12 md:col-span-4' },
        { id: 4, title: 'Fine Dining', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', span: 'col-span-12 md:col-span-4' },
        { id: 5, title: 'Infinity Pool', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', span: 'col-span-12 md:col-span-8' },
        { id: 6, title: 'Evening Beach', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', span: 'col-span-12 md:col-span-6' },
        { id: 7, title: 'Premium Suite', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', span: 'col-span-12 md:col-span-6' }
    ],
    amenities: {
        'Ocean Front Spa': {
            title: 'Ocean Front Spa',
            desc: 'Indulge in world-class treatments while listening to the rhythmic sounds of the ocean waves. Features 12 private treatment rooms, serene hydrotherapy pools, and highly skilled expert therapists dedicated to your wellness.',
            img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            features: ['Hydrotherapy', 'Couples Massage', 'Yoga Classes', 'Sauna'],
            color: 'from-cyan-500 to-blue-500'
        },
        'Infinity Pool': {
            title: 'Infinity Pool',
            desc: 'Our signature pool seamlessly blends with the horizon, offering breathtaking sunset views every evening. Features a swim-up bar, submerged loungers, and exclusive private cabanas.',
            img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            features: ['Swim-up Bar', 'Heated Water', 'Private Cabanas', 'Towel Service'],
            color: 'from-blue-400 to-indigo-500'
        },
        'Sky Lounge': {
            title: 'Sky Lounge',
            desc: 'Exclusive rooftop access featuring craft cocktails and 360-degree panoramic views of the coast. Perfect for sunset photography, evening relaxation and upscale socializing.',
            img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            features: ['Craft Cocktails', 'Live DJ', 'Panoramic Views', 'VIP Seating'],
            color: 'from-purple-500 to-pink-500'
        }
    },
    suites: {
        'Oceanic Master Suite': {
            title: 'Oceanic Master Suite',
            desc: 'Enjoy unobstructed panoramic views of the Amalfi coast right from your bed, complete with a private infinity plunge pool and dedicated e-Butler service. 220 m² of pure luxury designed to elevate the senses.',
            img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            features: ['220 m² Space', 'Private Plunge Pool', 'Butler Service', 'Panoramic Ocean View'],
            price: '$1,200',
            color: 'from-slate-800 to-slate-900'
        },
        'Azure Terrace Room': {
            title: 'Azure Terrace Room',
            desc: 'A luminous, spacious room featuring a private wrap-around terrace overlooking the azure waters of the sea. Perfect for couples seeking a romantic getaway.',
            img: 'https://images.unsplash.com/photo-1542314831-c6a4d27ece91?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            features: ['80 m² Space', 'Private Terrace', 'King Bed', 'Rain Shower'],
            price: '$450',
            color: 'from-blue-600 to-cyan-600'
        },
        'Coral Reef Villa': {
            title: 'Coral Reef Villa',
            desc: 'A highly secluded beachfront villa just steps away from the magnificent coral reef. Features a private lush garden, outdoor shower, and direct beach access.',
            img: 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            features: ['150 m² Space', 'Direct Beachfront', 'Private Garden', 'Outdoor Shower'],
            price: '$890',
            color: 'from-emerald-500 to-teal-600'
        },
        'All Rooms': {
            title: 'Blue Beach Suites & Villas',
            desc: 'Explore our wide range of carefully curated accommodations. From elegantly appointed standard rooms to exquisite beachfront villas, each is meticulously designed for your ultimate comfort and relaxation.',
            img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            features: ['Ocean Views', '24/7 Room Service', 'Premium Bedding', 'Smart Home Tech'],
            price: 'Starts $250',
            color: 'from-slate-700 to-slate-800'
        }
    },
    dining: {
        'The Azure Grill': {
            title: 'The Azure Grill',
            desc: 'A refined fine-dining experience featuring the freshest local seafood and prime cuts of meat, expertly prepared by our Michelin-starred chefs in an elegant ocean-facing setting.',
            img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            features: ['Fine Dining', 'Seafood & Steaks', 'Dress Code: Smart Casual', 'Reservations Required'],
            time: '19:00 - 23:00',
            color: 'from-rose-500 to-red-600'
        },
        'Sands Café': {
            title: 'Sands Café',
            desc: 'A genuinely relaxed, casual beachfront café offering freshly prepared light bites, artisan coffee, and refreshing tropical drinks throughout the day.',
            img: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            features: ['Casual Dining', 'Artisan Coffee', 'Beachfront', 'No Reservations'],
            time: '08:00 - 18:00',
            color: 'from-amber-500 to-orange-500'
        },
        'Luna Rooftop': {
            title: 'Luna Rooftop',
            desc: 'Our premier cocktail bar located on the rooftop. Enjoy experimental mixology, live acoustic music, and curated tapas while overlooking the spectacular night sky.',
            img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            features: ['Cocktail Bar', 'Tapas', 'Live Music', 'Adults Only'],
            time: '17:00 - 02:00',
            color: 'from-indigo-600 to-violet-700'
        }
    },
    experiences: {
        'All Experiences': {
            title: 'Discover More Experiences',
            desc: 'At Blue Beach, your stay goes beyond the ordinary. We offer curated experiences such as Yacht Expeditions to secret coastal caves, Private Beach Dinners under the stars with a live cellist, and Coral Diving with certified marine biologists.',
            img: 'https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            features: ['Yacht Expeditions', 'Private Beach Dinner', 'Coral Diving', 'Helicopter Tours'],
            price: 'Varies',
            color: 'from-blue-600 to-indigo-600'
        }
    }
};

// GET /api/public/landing
router.get('/landing', (req, res) => {
    res.json(landingData);
});

module.exports = router;
