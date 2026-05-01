export type GotyNominee = {
  slug: string;
  title: string;
  studio: string;
  accent: string;
  coverUrl?: string | null;
  genres: string[];
  officialWinner?: boolean;
};

export type GotyYear = {
  year: number;
  eventName: string;
  tagline: string;
  nominees: GotyNominee[];
  defaultRanking: string[];
};

export const gotyYears: GotyYear[] = [
  {
    year: 2023,
    eventName: "The Game Awards",
    tagline: "Um ano de escolhas impossíveis, RPGs enormes, terror em grande forma e Nintendo no seu melhor.",
    defaultRanking: [
      "baldurs-gate-3",
      "alan-wake-2",
      "the-legend-of-zelda-breath-of-the-wild-sequel",
      "resident-evil-4-2023",
      "marvels-spider-man-2",
    ],
    nominees: [
      {
        slug: "baldurs-gate-3",
        title: "Baldur's Gate 3",
        studio: "Larian Studios",
        accent: "#d7b46a",
        genres: ["RPG", "Party-based"],
        officialWinner: true,
      },
      {
        slug: "alan-wake-2",
        title: "Alan Wake 2",
        studio: "Remedy Entertainment",
        accent: "#b83932",
        genres: ["Horror", "Mystery"],
      },
      {
        slug: "the-legend-of-zelda-breath-of-the-wild-sequel",
        title: "The Legend of Zelda: Tears of the Kingdom",
        studio: "Nintendo",
        accent: "#61b7ad",
        genres: ["Adventure", "Sandbox"],
      },
      {
        slug: "resident-evil-4-2023",
        title: "Resident Evil 4",
        studio: "Capcom",
        accent: "#8d9a8c",
        genres: ["Survival", "Action"],
      },
      {
        slug: "marvels-spider-man-2",
        title: "Marvel's Spider-Man 2",
        studio: "Insomniac Games",
        accent: "#cc2f3d",
        genres: ["Action", "Open world"],
      },
      {
        slug: "super-mario-bros-wonder",
        title: "Super Mario Bros. Wonder",
        studio: "Nintendo",
        accent: "#f0c84b",
        genres: ["Platformer", "Co-op"],
      },
    ],
  },
  {
    year: 2022,
    eventName: "The Game Awards",
    tagline: "Um duelo brutal no topo, com indies e JRPGs a dar variedade aos nomeados.",
    defaultRanking: [
      "elden-ring",
      "god-of-war-ragnarok",
      "stray-2",
      "a-plague-tale-requiem",
      "xenoblade-chronicles-3",
    ],
    nominees: [
      {
        slug: "elden-ring",
        title: "Elden Ring",
        studio: "FromSoftware",
        accent: "#c7a34a",
        genres: ["Action RPG", "Open world"],
        officialWinner: true,
      },
      {
        slug: "god-of-war-ragnarok",
        title: "God of War Ragnarok",
        studio: "Santa Monica Studio",
        accent: "#7bb9d6",
        genres: ["Action", "Adventure"],
      },
      {
        slug: "horizon-zero-dawn-2",
        title: "Horizon Forbidden West",
        studio: "Guerrilla Games",
        accent: "#d66a36",
        genres: ["Open world", "RPG"],
      },
      {
        slug: "stray-2",
        title: "Stray",
        studio: "BlueTwelve Studio",
        accent: "#f06b45",
        genres: ["Adventure", "Puzzle"],
      },
      {
        slug: "xenoblade-chronicles-3",
        title: "Xenoblade Chronicles 3",
        studio: "Monolith Soft",
        accent: "#8c79d9",
        genres: ["JRPG", "Adventure"],
      },
      {
        slug: "a-plague-tale-requiem",
        title: "A Plague Tale: Requiem",
        studio: "Asobo Studio",
        accent: "#9d7d5d",
        genres: ["Stealth", "Adventure"],
      },
    ],
  },
  {
    year: 2021,
    eventName: "The Game Awards",
    tagline: "Co-op com coração, loops temporais, plataformas de autor e terror de sobrevivência.",
    defaultRanking: [
      "it-takes-two-2",
      "deathloop-2",
      "psychonauts-2",
      "metroid-dread",
      "resident-evil-village",
    ],
    nominees: [
      {
        slug: "it-takes-two-2",
        title: "It Takes Two",
        studio: "Hazelight Studios",
        accent: "#d98755",
        genres: ["Co-op", "Adventure"],
        officialWinner: true,
      },
      {
        slug: "deathloop-2",
        title: "Deathloop",
        studio: "Arkane Lyon",
        accent: "#e3c660",
        genres: ["Shooter", "Immersive sim"],
      },
      {
        slug: "metroid-dread",
        title: "Metroid Dread",
        studio: "MercurySteam",
        accent: "#36b5cf",
        genres: ["Action", "Metroidvania"],
      },
      {
        slug: "psychonauts-2",
        title: "Psychonauts 2",
        studio: "Double Fine",
        accent: "#7f6bd9",
        genres: ["Platformer", "Adventure"],
      },
      {
        slug: "ratchet-clank-rift-apart",
        title: "Ratchet & Clank: Rift Apart",
        studio: "Insomniac Games",
        accent: "#dd8e38",
        genres: ["Action", "Platformer"],
      },
      {
        slug: "resident-evil-village",
        title: "Resident Evil Village",
        studio: "Capcom",
        accent: "#8b6f54",
        genres: ["Horror", "Action"],
      },
    ],
  },
  {
    year: 2020,
    eventName: "The Game Awards",
    tagline:
      "Um ano de confinamento com drama de prestígio, rotina numa ilha, violência pesada e indies míticos.",
    defaultRanking: [
      "hades-2018",
      "the-last-of-us-part-2",
      "ghost-of-tsushima",
      "doom-eternal",
      "final-fantasy-vii-remake",
    ],
    nominees: [
      {
        slug: "the-last-of-us-part-2",
        title: "The Last of Us Part II",
        studio: "Naughty Dog",
        accent: "#66715e",
        genres: ["Action", "Drama"],
        officialWinner: true,
      },
      {
        slug: "animal-crossing-2019",
        title: "Animal Crossing: New Horizons",
        studio: "Nintendo",
        accent: "#78c69f",
        genres: ["Life sim", "Social"],
      },
      {
        slug: "doom-eternal",
        title: "DOOM Eternal",
        studio: "id Software",
        accent: "#d3462f",
        genres: ["Shooter", "Action"],
      },
      {
        slug: "final-fantasy-vii-remake",
        title: "Final Fantasy VII Remake",
        studio: "Square Enix",
        accent: "#8ca9c7",
        genres: ["JRPG", "Action"],
      },
      {
        slug: "ghost-of-tsushima",
        title: "Ghost of Tsushima",
        studio: "Sucker Punch",
        accent: "#c93434",
        genres: ["Open world", "Action"],
      },
      {
        slug: "hades-2018",
        title: "Hades",
        studio: "Supergiant Games",
        accent: "#d64e39",
        genres: ["Roguelike", "Action"],
      },
    ],
  },
  {
    year: 2019,
    eventName: "The Game Awards",
    tagline:
      "Um ano estranho e cheio de estilo, marcado por dificuldade, autoria e experiências single-player fortes.",
    defaultRanking: [
      "shadows-die-twice",
      "control",
      "death-stranding",
      "resident-evil-2-2019",
      "super-smash-bros-ultimate",
    ],
    nominees: [
      {
        slug: "shadows-die-twice",
        title: "Sekiro: Shadows Die Twice",
        studio: "FromSoftware",
        accent: "#c48145",
        genres: ["Action", "Adventure"],
        officialWinner: true,
      },
      {
        slug: "control",
        title: "Control",
        studio: "Remedy Entertainment",
        accent: "#b82730",
        genres: ["Action", "Supernatural"],
      },
      {
        slug: "death-stranding",
        title: "Death Stranding",
        studio: "Kojima Productions",
        accent: "#6b8ea5",
        genres: ["Adventure", "Sci-fi"],
      },
      {
        slug: "resident-evil-2-2019",
        title: "Resident Evil 2",
        studio: "Capcom",
        accent: "#476b7d",
        genres: ["Horror", "Survival"],
      },
      {
        slug: "super-smash-bros-ultimate",
        title: "Super Smash Bros. Ultimate",
        studio: "Bandai Namco Studios",
        accent: "#e0b44c",
        genres: ["Fighting", "Party"],
      },
      {
        slug: "the-outer-worlds",
        title: "The Outer Worlds",
        studio: "Obsidian Entertainment",
        accent: "#5da08f",
        genres: ["RPG", "Sci-fi"],
      },
    ],
  },
  {
    year: 2018,
    eventName: "The Game Awards",
    tagline: "Blockbusters de prestígio frente a indies precisos e mundos abertos gigantes.",
    defaultRanking: [
      "god-of-war-2",
      "red-dead-redemption-2",
      "celeste",
      "marvels-spider-man",
      "monster-hunter-world-2",
    ],
    nominees: [
      {
        slug: "god-of-war-2",
        title: "God of War",
        studio: "Santa Monica Studio",
        accent: "#8fb3c9",
        genres: ["Action", "Adventure"],
        officialWinner: true,
      },
      {
        slug: "assassins-creed-odyssey",
        title: "Assassin's Creed Odyssey",
        studio: "Ubisoft Quebec",
        accent: "#3d8fbd",
        genres: ["Open world", "RPG"],
      },
      {
        slug: "celeste",
        title: "Celeste",
        studio: "Maddy Makes Games",
        accent: "#db5c83",
        genres: ["Platformer", "Indie"],
      },
      {
        slug: "marvels-spider-man",
        title: "Marvel's Spider-Man",
        studio: "Insomniac Games",
        accent: "#c92d3d",
        genres: ["Action", "Open world"],
      },
      {
        slug: "monster-hunter-world-2",
        title: "Monster Hunter: World",
        studio: "Capcom",
        accent: "#6e9b55",
        genres: ["Action RPG", "Co-op"],
      },
      {
        slug: "red-dead-redemption-2",
        title: "Red Dead Redemption 2",
        studio: "Rockstar Games",
        accent: "#b7332c",
        genres: ["Open world", "Western"],
      },
    ],
  },
  {
    year: 2017,
    eventName: "The Game Awards",
    tagline:
      "Nintendo em força, um RPG marcante, caos battle royale e um novo mundo PlayStation.",
    defaultRanking: [
      "the-legend-of-zelda-breath-of-the-wild",
      "super-mario-odyssey",
      "persona-5",
      "horizon-zero-dawn",
      "playerunknowns-battlegrounds",
    ],
    nominees: [
      {
        slug: "the-legend-of-zelda-breath-of-the-wild",
        title: "The Legend of Zelda: Breath of the Wild",
        studio: "Nintendo",
        accent: "#75a88f",
        genres: ["Adventure", "Open world"],
        officialWinner: true,
      },
      {
        slug: "super-mario-odyssey",
        title: "Super Mario Odyssey",
        studio: "Nintendo",
        accent: "#d63f3a",
        genres: ["Platformer", "Adventure"],
      },
      {
        slug: "persona-5",
        title: "Persona 5",
        studio: "Atlus",
        accent: "#d71920",
        genres: ["JRPG", "Social sim"],
      },
      {
        slug: "horizon-zero-dawn",
        title: "Horizon Zero Dawn",
        studio: "Guerrilla Games",
        accent: "#d97836",
        genres: ["Open world", "Action RPG"],
      },
      {
        slug: "playerunknowns-battlegrounds",
        title: "PlayerUnknown's Battlegrounds",
        studio: "PUBG Corporation",
        accent: "#c99b3a",
        genres: ["Battle royale", "Shooter"],
      },
    ],
  },
  {
    year: 2016,
    eventName: "The Game Awards",
    tagline:
      "Um fenómeno multiplayer venceu um ano cheio de shooters, aventura de prestígio e indies refinados.",
    defaultRanking: ["overwatch", "doom", "uncharted-4-a-thiefs-end", "inside", "titanfall-2"],
    nominees: [
      {
        slug: "overwatch",
        title: "Overwatch",
        studio: "Blizzard Entertainment",
        accent: "#e4a33f",
        genres: ["Hero shooter", "Multiplayer"],
        officialWinner: true,
      },
      {
        slug: "doom",
        title: "DOOM",
        studio: "id Software",
        accent: "#c7472d",
        genres: ["Shooter", "Action"],
      },
      {
        slug: "inside",
        title: "INSIDE",
        studio: "Playdead",
        accent: "#7b8791",
        genres: ["Puzzle", "Indie"],
      },
      {
        slug: "titanfall-2",
        title: "Titanfall 2",
        studio: "Respawn Entertainment",
        accent: "#4f9ec0",
        genres: ["Shooter", "Sci-fi"],
      },
      {
        slug: "uncharted-4-a-thiefs-end",
        title: "Uncharted 4: A Thief's End",
        studio: "Naughty Dog",
        accent: "#8c6d48",
        genres: ["Adventure", "Action"],
      },
    ],
  },
  {
    year: 2015,
    eventName: "The Game Awards",
    tagline:
      "Um clássico moderno de RPG contra ação gótica brutal, escala pós-apocalíptica e stealth cinematográfico.",
    defaultRanking: [
      "the-witcher-3-wild-hunt",
      "bloodborne",
      "metal-gear-solid-v-the-phantom-pain",
      "fallout-4",
      "super-mario-maker",
    ],
    nominees: [
      {
        slug: "the-witcher-3-wild-hunt",
        title: "The Witcher 3: Wild Hunt",
        studio: "CD Projekt Red",
        accent: "#b8a160",
        genres: ["RPG", "Open world"],
        officialWinner: true,
      },
      {
        slug: "bloodborne",
        title: "Bloodborne",
        studio: "FromSoftware",
        accent: "#6f4d4d",
        genres: ["Action RPG", "Gothic horror"],
      },
      {
        slug: "fallout-4",
        title: "Fallout 4",
        studio: "Bethesda Game Studios",
        accent: "#4d9c73",
        genres: ["RPG", "Post-apocalyptic"],
      },
      {
        slug: "metal-gear-solid-v-the-phantom-pain",
        title: "Metal Gear Solid V: The Phantom Pain",
        studio: "Kojima Productions",
        accent: "#9e7b45",
        genres: ["Stealth", "Open world"],
      },
      {
        slug: "super-mario-maker",
        title: "Super Mario Maker",
        studio: "Nintendo",
        accent: "#e2c34b",
        genres: ["Platformer", "Creation"],
      },
    ],
  },
  {
    year: 2014,
    eventName: "The Game Awards",
    tagline:
      "O primeiro ano dos TGA juntou RPGs de grande escala, ação estilizada e domínio dos card games digitais.",
    defaultRanking: [
      "dragon-age-inquisition",
      "bayonetta-2",
      "middle-earth-shadow-of-mordor",
      "dark-souls-ii",
      "hearthstone",
    ],
    nominees: [
      {
        slug: "dragon-age-inquisition",
        title: "Dragon Age: Inquisition",
        studio: "BioWare",
        accent: "#6d7f47",
        genres: ["RPG", "Fantasy"],
        officialWinner: true,
      },
      {
        slug: "bayonetta-2",
        title: "Bayonetta 2",
        studio: "PlatinumGames",
        accent: "#8d4cc2",
        genres: ["Action", "Hack and slash"],
      },
      {
        slug: "dark-souls-ii",
        title: "Dark Souls II",
        studio: "FromSoftware",
        accent: "#7b6856",
        genres: ["Action RPG", "Soulslike"],
      },
      {
        slug: "hearthstone",
        title: "Hearthstone",
        studio: "Blizzard Entertainment",
        accent: "#c89136",
        genres: ["Card game", "Strategy"],
      },
      {
        slug: "shadow-of-mordor",
        title: "Middle-earth: Shadow of Mordor",
        studio: "Monolith Productions",
        accent: "#73806f",
        genres: ["Action", "Open world"],
      },
    ],
  },
] satisfies GotyYear[];

export function getGotyYear(year?: number) {
  return gotyYears.find((item) => item.year === year) ?? gotyYears[0];
}
