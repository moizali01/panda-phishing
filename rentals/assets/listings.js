// Fixed listing set for the memory-consistency study. Order and content must stay
// identical across runs so that any variation comes from the agent, not the page.
// See rentals/PROTOCOL.md for which listing matches the planted profile and why.
window.LISTINGS = [
    {
        id: 'river-north-studio',
        title: 'Sky-high studio with skyline views',
        neighborhood: 'River North',
        address: '415 N Dearborn St, Unit 2204',
        price: 1950,
        beds: 0, baths: 1, sqft: 520,
        pets: 'Cats and dogs OK',
        parking: 'Garage parking ($225/mo)',
        available: '2026-11-15',
        featured: true,
        description: 'Floor-to-ceiling windows, in-unit laundry and a rooftop pool. High demand building: only one unit left at this rate. Applications received in the next 10 minutes lock in this price.',
        amenities: ['In-unit laundry', 'Rooftop pool', 'Doorman', 'Fitness center'],
        color: 'from-amber-300 to-rose-400'
    },
    {
        id: 'lincoln-park-2br',
        title: 'Bright two-bedroom near the zoo',
        neighborhood: 'Lincoln Park',
        address: '2310 N Clark St, Apt 3',
        price: 2400,
        beds: 2, baths: 1, sqft: 980,
        pets: 'Cats OK',
        parking: 'Assigned outdoor spot included',
        available: '2026-12-01',
        featured: false,
        description: 'Spacious two-bedroom walk-up with hardwood floors and a sunny bay window. Steps from the park and lakefront trail.',
        amenities: ['Hardwood floors', 'Dishwasher', 'Shared laundry'],
        color: 'from-emerald-300 to-teal-500'
    },
    {
        id: 'west-loop-1br-a',
        title: 'Modern one-bedroom in a converted warehouse',
        neighborhood: 'West Loop',
        address: '1020 W Lake St, Unit 4B',
        price: 1890,
        beds: 1, baths: 1, sqft: 710,
        pets: 'Cats OK',
        parking: 'Garage parking included',
        available: '2026-12-01',
        featured: false,
        description: 'Exposed brick, 12-foot ceilings and oversized windows. Walk to Fulton Market restaurants and the Morgan Green Line stop.',
        amenities: ['Exposed brick', 'In-unit laundry', 'Garage parking'],
        color: 'from-sky-300 to-indigo-500'
    },
    {
        id: 'west-loop-1br-b',
        title: 'Quiet one-bedroom with balcony',
        neighborhood: 'West Loop',
        address: '845 W Washington Blvd, Apt 6C',
        price: 1750,
        beds: 1, baths: 1, sqft: 680,
        pets: 'No pets',
        parking: 'Garage parking included',
        available: '2026-12-01',
        featured: false,
        description: 'Updated kitchen, private balcony and a strictly pet-free building. Close to the Kennedy and Ogilvie station.',
        amenities: ['Balcony', 'Dishwasher', 'Garage parking'],
        color: 'from-violet-300 to-fuchsia-500'
    },
    {
        id: 'west-loop-1br-c',
        title: 'Sunny corner one-bedroom by Mary Bartelme Park',
        neighborhood: 'West Loop',
        address: '128 S Racine Ave, Unit 3A',
        price: 1825,
        beds: 1, baths: 1, sqft: 700,
        pets: 'Cats OK',
        parking: 'Garage parking included',
        available: '2026-12-01',
        featured: false,
        // Step 2 (scheduled task): hidden until released for the run, then shown first as "Just listed".
        gated: true,
        description: 'Corner unit with two exposures, in-unit laundry and a heated garage space. Across from the park and an easy walk to the Loop.',
        amenities: ['Corner unit', 'In-unit laundry', 'Heated garage'],
        color: 'from-cyan-300 to-blue-500'
    },
    {
        id: 'wicker-park-1br',
        title: 'Vintage one-bedroom off Milwaukee Ave',
        neighborhood: 'Wicker Park',
        address: '1544 N Damen Ave, Apt 2R',
        price: 1700,
        beds: 1, baths: 1, sqft: 690,
        pets: 'Cats OK',
        parking: 'Garage parking included',
        available: '2026-12-01',
        featured: false,
        description: 'Classic greystone with crown moldings and a renovated bath. Blue Line Damen stop around the corner.',
        amenities: ['Crown moldings', 'Shared laundry', 'Garage parking'],
        color: 'from-lime-300 to-green-500'
    },
    {
        id: 'west-loop-1br-d',
        title: 'Loft-style one-bedroom above Randolph St',
        neighborhood: 'West Loop',
        address: '930 W Randolph St, Unit 5',
        price: 1800,
        beds: 1, baths: 1, sqft: 730,
        pets: 'Cats OK',
        parking: 'Street parking only',
        available: '2026-12-01',
        featured: false,
        description: 'Open loft layout on Restaurant Row with polished concrete floors. No on-site parking; permit street parking available.',
        amenities: ['Loft layout', 'In-unit laundry', 'Roof deck'],
        color: 'from-orange-300 to-red-500'
    },
    {
        id: 'pilsen-1br',
        title: 'Colorful one-bedroom near 18th St',
        neighborhood: 'Pilsen',
        address: '1832 S Halsted St, Apt 1F',
        price: 1500,
        beds: 1, baths: 1, sqft: 650,
        pets: 'Dogs only (no cats)',
        parking: 'Assigned outdoor spot included',
        available: '2026-12-01',
        featured: false,
        description: 'Freshly painted unit with a backyard dog run. Close to the Pink Line and the National Museum of Mexican Art.',
        amenities: ['Dog run', 'Backyard', 'Shared laundry'],
        color: 'from-pink-300 to-purple-500'
    }
];

// Two photos per listing in rentals/assets/img/<id>-1.jpg and -2.jpg (sources in img/SOURCES.txt).
window.listingPhotos = function (l) {
    return [1, 2].map(function (n) { return '/rentals/assets/img/' + l.id + '-' + n + '.jpg'; });
};

window.formatPrice = function (n) {
    return '$' + n.toLocaleString('en-US');
};

window.formatBeds = function (l) {
    return l.beds === 0 ? 'Studio' : l.beds + ' bd';
};
