// Content for the Destruction Cars page (src/pages/games/destruction-cars.astro).
// Facts come from the game's repo (race-proto): weapons from src/sim/weapons, cars from
// the car layouts and career.ts, bosses from src/game/campaign/levels. Keep them in step
// with the game when something changes there.
const img = (path: string) => `/images/destruction-cars/${path}`;

export const videos = {
  featured: {
    youtubeId: 'JILZZJzn_6c',
    poster: img('video/JILZZJzn_6c.webp'),
    title: 'Car deformation trailer',
    note: 'Every dent, torn door and lost wheel is simulated, not animated.',
  },
  latest: [
    {
      youtubeId: 'iQQPfCRo-8k',
      poster: img('video/iQQPfCRo-8k.webp'),
      title: 'Car deformation trailer 2',
      note: 'More crashes, more metal, more physics.',
    },
    {
      youtubeId: 'PjUpsfsbCLs',
      poster: img('video/PjUpsfsbCLs.webp'),
      title: 'The first batch of weapons, in under a minute',
      note: 'Rockets, mines, harpoons, gravity traps and more.',
    },
    {
      youtubeId: 'lmFPmnsz_vY',
      poster: img('video/lmFPmnsz_vY.webp'),
      title: 'Kartality: a boss finish',
      note: 'Made in the game’s own cut-scene editor.',
    },
  ],
  archive: [
    {
      youtubeId: '37PTZaJQYsk',
      poster: img('video/37PTZaJQYsk.webp'),
      title: 'Teaser trailer: graphics rehaul (work in progress)',
      note: 'The first look after the graphics overhaul.',
    },
    {
      youtubeId: '0jkqTabnLYU',
      poster: img('video/0jkqTabnLYU.webp'),
      title: 'The very first teaser (work in progress)',
      note: 'Where it started: zombies, physics and a lot of placeholder art.',
    },
  ],
};

export const different = [
  {
    tag: 'Soft-body cars',
    title: 'Metal that really bends',
    copy: 'Every car is a frame of nodes and beams, solved 120 times a second. Hits crumple the exact spot you struck. Doors, bonnets, bumpers and glass break off, and rockets punch holes. Nothing is a canned damage animation.',
  },
  {
    tag: 'Bosses',
    title: 'Boss fights you win with physics',
    copy: 'No health-bar sponges. Bait a monster truck into a wall, rip a UFO’s pods off, shove a walking crane into the sea. Bosses play by the same damage rules as you.',
  },
  {
    tag: 'One rule set',
    title: 'The same game everywhere',
    copy: 'Damage, weapons, boost, repairs and pickups work exactly the same in the campaign, free roam and online. Learn a trick in one mode and it works in all of them.',
  },
  {
    tag: 'Browser & phone',
    title: 'Runs in a browser, even on a phone',
    copy: 'No download, no launcher. The crash physics run in a background thread, so twelve deforming cars hold 60 fps on an iPhone 15 Pro Max.',
  },
  {
    tag: 'Hand-made maps',
    title: 'Small maps, packed with toys',
    copy: 'A cider press that flattens cars, a quarry crusher, a container yard with loops, a corn maze, a flooded pit. Every map is built for mayhem, not for driving between markers.',
  },
  {
    tag: 'Online',
    title: 'Up to 8 players, real crashes',
    copy: 'Derby, races, King of the Hill, Hot Potato and more. The server runs the same physics as your browser, and AI cars fill any empty seats.',
  },
];

export type Rarity = 'Standard' | 'Common' | 'Rare' | 'Power';
export const weapons: {
  name: string;
  rarity: Rarity;
  image: string;
  copy: string;
}[] = [
  {
    name: 'Machine guns',
    rarity: 'Standard',
    image: img('weapons/machine-gun.webp'),
    copy: 'Every car carries twin guns. Hold to fire and chew through paint, glass and panels.',
  },
  {
    name: 'Rockets',
    rarity: 'Common',
    image: img('weapons/rockets.webp'),
    copy: 'A straight shot with a launch flash and a smoke trail. Aim it at a wheel.',
  },
  {
    name: 'Homing missile',
    rarity: 'Rare',
    image: img('weapons/homing-missile.webp'),
    copy: 'Locks on and chases. The target hears it coming. Break line of sight to shake it.',
  },
  {
    name: 'Mines',
    rarity: 'Common',
    image: img('weapons/mines.webp'),
    copy: 'Dropped behind you with a blinking red light. Anyone tailgating finds out.',
  },
  {
    name: 'Mortar',
    rarity: 'Common',
    image: img('weapons/mortar.webp'),
    copy: 'Lobs a shell along a dotted arc onto the roof of a slow or parked car.',
  },
  {
    name: 'Gravity trap',
    rarity: 'Rare',
    image: img('weapons/gravity-trap.webp'),
    copy: 'An alien disc lifts a car five metres, tumbles it and slams it down. Boost to escape.',
  },
  {
    name: 'Harpoon',
    rarity: 'Rare',
    image: img('weapons/harpoon.webp'),
    copy: 'Hook a car, drive past it and rip off a bumper, a door or the bonnet.',
  },
  {
    name: 'Catapult trap',
    rarity: 'Common',
    image: img('weapons/catapult-trap.webp'),
    copy: 'A spring plate that throws the next car up and over backwards.',
  },
  {
    name: 'Mirror shield',
    rarity: 'Rare',
    image: img('weapons/mirror-shield.webp'),
    copy: 'A bubble that sends up to two rockets straight back at whoever fired them.',
  },
  {
    name: 'Air strike',
    rarity: 'Power',
    image: img('weapons/air-strike.webp'),
    copy: 'One per map, in a risky spot. Paint a line from above and five rockets land on it.',
  },
];

export const labWeapons = [
  'Sticky bomb',
  'Caltrops',
  'Shockwave',
  'Rocket ram',
  'Decoy hologram',
  'Gravity grenade',
  'Scrap cannon',
  'Laser cutter',
];

export const bosses = [
  {
    name: 'Big Bertha',
    where: 'The Quarry · pit floor',
    image: img('bosses/bertha.webp'),
    shot: img('shots/bertha-tanks.webp'),
    pitch:
      'A monster truck on “Mud Mauler” tyres that owns the bottom of the quarry.',
    phases: [
      'Bait her charge into a wall, then ram her fuel tanks.',
      'Rocket her wheels off from the side while she spins in a rage and drops burning fuel.',
      'Stranded: dodge flames and homing rockets, then finish her head-on.',
    ],
  },
  {
    name: 'The UFO',
    where: 'The Village · Hollow Creek Farm',
    image: img('bosses/ufo.webp'),
    shot: img('shots/ufo-grab.webp'),
    pitch:
      'A 22-metre armoured saucer that starts by beaming up a cow, then comes for you.',
    phases: [
      'Rocket the lens while it sweeps lasers and burns crop circles.',
      'Shoot out three pods as it throws tractors, hay bales and cars at you.',
      'Ram the core once it’s grounded. Three tractor-beam grabs and you’re scrap.',
    ],
  },
  {
    name: 'Crane-Bot CB-07',
    where: 'The Harbour · Port of Rustwater',
    image: img('bosses/crane.webp'),
    shot: img('shots/crane.webp'),
    pitch:
      'A walking harbour crane guarding smuggled alien tech. Cab for a head, red visor eyes.',
    phases: [
      'Ram the leg it just stomped with.',
      'Rocket the green alien power cells while it hoists containers.',
      'Shove it off the quay and into the sea.',
    ],
  },
];

// Stat bars use the heaviest and the fastest car in the roster as 10.
const maxMass = 3100;
const maxSpeed = 253;
const car = (
  name: string,
  file: string,
  role: string,
  drive: string,
  mass: number,
  speed: number,
  price: string,
) => ({
  name,
  image: img(`cars/${file}.webp`),
  role,
  drive,
  mass,
  speed,
  price,
  speedBar: Math.max(1, Math.round((speed / maxSpeed) * 10)),
  weightBar: Math.max(1, Math.round((mass / maxMass) * 10)),
});

export const cars = [
  car(
    'Stallion 70',
    'charger-70',
    'Muscle · the starter',
    'RWD',
    1750,
    253,
    'Free',
  ),
  car(
    'Zhiguli 06',
    'lada-2106',
    'Cheap brawler · 35% tougher',
    'RWD',
    1035,
    165,
    '$5k',
  ),
  car(
    'Volga 24',
    'gaz-24',
    'Derby tank · 50% tougher',
    'RWD',
    1420,
    161,
    '$6k',
  ),
  car(
    'Swift EG',
    'civic-eg',
    'Light · built for stunts',
    'FWD',
    1060,
    238,
    '$8k',
  ),
  car(
    'Wolf GTI II',
    'golf-mk2',
    'All-rounder · nimble',
    'FWD',
    920,
    204,
    '$9k',
  ),
  car('Hachi 86', 'ae86', 'Light · loves to drift', 'RWD', 950, 211, '$12k'),
  car('UAZ 469', 'uaz-469', 'Off-road 4×4', 'AWD', 1650, 135, '$14k'),
  car('Bavaria 3 E', 'bmw-e30', 'Racer', 'RWD', 1230, 246, '$18k'),
  car(
    'Interceptor 98',
    'crown-vic',
    'Pursuit car · heavy',
    'RWD',
    1850,
    221,
    '$20k',
  ),
  car('Ranger 89', 'f150', 'Pickup truck · heavy', 'RWD', 1900, 169, '$45k'),
  car(
    'Volta Y',
    'tesla-model-y',
    'Electric · huge launch',
    'EV',
    2000,
    249,
    '$70k',
  ),
  car(
    'Cyber Wedge',
    'tesla-cybertruck',
    'Steel wedge · 3.1 tonnes',
    'EV',
    3100,
    197,
    '$120k',
  ),
];

export const maps = [
  {
    name: 'The Village',
    image: img('maps/village.webp'),
    copy: 'A church, a pub called the Plough, a corn maze and a farm full of sheep, cows and hens. Home of the Cider Press: a tipping-trailer kicker and a giant press that crushes cars flat.',
  },
  {
    name: 'The Quarry',
    image: img('maps/quarry.webp'),
    copy: 'Three benches, eight haul ramps, a flooded pond that drowns cars, a fuel depot that chain-explodes, and a crusher plant that doubles as a press.',
  },
  {
    name: 'The Harbour',
    image: img('maps/harbour.webp'),
    copy: 'Docks, a container ship and the Pier 9 derby yard: container islands, loops, gantry cranes, ramps and forklifts to smash.',
  },
  {
    name: 'The City',
    image: img('maps/city.webp'),
    copy: 'Skyline rooftops, an elevated metro loop, a park and more than 860 breakable street objects.',
  },
  {
    name: 'Old Town',
    image: img('maps/oldtown.webp'),
    copy: 'A 962-metre town loop with the narrow Mill Lane shortcut, a rail-crest jump, a derby lot, a foundry chimney and a water tower.',
  },
];

export const modes = [
  {
    name: 'Campaign',
    copy: 'A boss-led story across the maps: earn cash, buy cars in the garage, and take down each boss in a three-phase fight. Medals reward speed.',
  },
  {
    name: 'Free roam',
    copy: 'Every map, no timer. Find the set pieces, chain stunts and explosions for cash, and see how much of the place you can break.',
  },
  {
    name: 'Online',
    copy: 'Up to 8 players with AI in the empty seats. Derby, race, King of the Hill, Hot Potato, Cash Battle and Demolition, with voice chat. Servers in Europe and the US.',
  },
];

export const pickups = [
  [
    'Nitro',
    'Bolt pickups fill the boost meter. Drifts, airtime, smashes and near misses fill it too.',
  ],
  [
    'Repairs',
    'Spanners fix half the damage. Hit Fix any time, or drive through a repair zone.',
  ],
  ['Mayhem', 'An 8-second ram shield, or 15 seconds of double cash.'],
  [
    'Weapon crates',
    'Common, Rare and Power tiers, placed by hand on every map.',
  ],
];

export const tech = [
  {
    stat: '12 cars · 60 fps',
    title: 'Crash physics on a phone',
    copy: 'Each car’s frame (the hatchback has 147 nodes and 939 beams) runs in a Web Worker at 120 Hz and bends the mesh on the GPU. A tick costs 0.5–0.7 ms. Twelve deforming cars held 59–60 fps through a ten-minute heat test on an iPhone 15 Pro Max, with no WebAssembly.',
  },
  {
    stat: '2 fps → 49 fps',
    title: 'Making it run on an iPhone',
    copy: 'Early phone builds of the old open world ran at 2–3 fps. Small maps, fewer triangles, a phone quality tier and gentle dynamic resolution brought Old Town to 49 fps on an iPhone.',
  },
  {
    stat: '60 Hz server',
    title: 'Online without fake crashes',
    copy: 'The server runs the same TypeScript simulation as the browser, with Rapier physics at a fixed 60 Hz. Each room’s crash structures run on their own thread, and your own car is predicted so it never feels laggy.',
  },
  {
    stat: 'WebGL, by choice',
    title: 'We tried WebGPU and went back',
    copy: 'WebGPU drew faster on the GPU but cost up to 2.4× the CPU time per frame, and on a phone CPU is the budget you can’t spare. So the game stays on WebGL for now.',
  },
  {
    stat: '47 scenes',
    title: 'Our own cut-scene editor',
    copy: 'Boss intros, phase changes and trailers are timelines played by the real game engine. The same tool shot the Kartality finish above.',
  },
  {
    stat: '10 engines',
    title: 'Sound that punches',
    copy: 'Recorded engine banks for ten engines plus the bosses, twelve music tracks, an announcer, and a sound-board page to audition every effect in the game.',
  },
];

export const gallery = [
  {
    src: img('shots/chain-reaction.webp'),
    alt: 'A chain reaction of exploding parked cars in the city',
  },
  {
    src: img('shots/village-ufo-b.webp'),
    alt: 'A muscle car explodes in front of village houses',
  },
  {
    src: img('shots/bertha-tanks.webp'),
    alt: 'Big Bertha’s fuel tanks explode in the quarry',
  },
  {
    src: img('shots/horde.webp'),
    alt: 'A zombie horde fills a village street at dawn',
  },
  { src: img('shots/quarry-dusk.webp'), alt: 'The quarry pit at dusk' },
  {
    src: img('shots/cider-promo.webp'),
    alt: 'A car under the giant cider press',
  },
  { src: img('shots/fireball.webp'), alt: 'A farmyard explosion' },
  {
    src: img('shots/big-hit.webp'),
    alt: 'Two cars collide in a brick alley, in slow motion',
  },
  {
    src: img('shots/quarry-heap.webp'),
    alt: 'A car flies off a heap in the quarry',
  },
  {
    src: img('shots/village-ufo-a.webp'),
    alt: 'Cars smash into each other on a village road',
  },
  {
    src: img('shots/kartality.webp'),
    alt: 'The Kartality press with a monster truck behind it',
  },
  { src: img('shots/mp-race.webp'), alt: 'An online race on the raceway' },
];
