// PokeMMO Pokedex Data - Regions: Kanto, Johto, Hoenn, Sinnoh, Teselia
// Format: [id, name, eggGroups[]]

const KANTO_DEX = [
[1,"Bulbasaur",["Monster","Grass"]],[2,"Ivysaur",["Monster","Grass"]],[3,"Venusaur",["Monster","Grass"]],
[4,"Charmander",["Monster","Dragon"]],[5,"Charmeleon",["Monster","Dragon"]],[6,"Charizard",["Monster","Dragon"]],
[7,"Squirtle",["Monster","Water 1"]],[8,"Wartortle",["Monster","Water 1"]],[9,"Blastoise",["Monster","Water 1"]],
[10,"Caterpie",["Bug"]],[11,"Metapod",["Bug"]],[12,"Butterfree",["Bug"]],
[13,"Weedle",["Bug"]],[14,"Kakuna",["Bug"]],[15,"Beedrill",["Bug"]],
[16,"Pidgey",["Flying"]],[17,"Pidgeotto",["Flying"]],[18,"Pidgeot",["Flying"]],
[19,"Rattata",["Field"]],[20,"Raticate",["Field"]],
[21,"Spearow",["Flying"]],[22,"Fearow",["Flying"]],
[23,"Ekans",["Field","Dragon"]],[24,"Arbok",["Field","Dragon"]],
[25,"Pikachu",["Field","Fairy"]],[26,"Raichu",["Field","Fairy"]],
[27,"Sandshrew",["Field"]],[28,"Sandslash",["Field"]],
[29,"Nidoran♀",["Monster","Field"]],[30,"Nidorina",["No Eggs"]],[31,"Nidoqueen",["No Eggs"]],
[32,"Nidoran♂",["Monster","Field"]],[33,"Nidorino",["Monster","Field"]],[34,"Nidoking",["Monster","Field"]],
[35,"Clefairy",["Fairy"]],[36,"Clefable",["Fairy"]],
[37,"Vulpix",["Field"]],[38,"Ninetales",["Field"]],
[39,"Jigglypuff",["Fairy"]],[40,"Wigglytuff",["Fairy"]],
[41,"Zubat",["Flying"]],[42,"Golbat",["Flying"]],
[43,"Oddish",["Grass"]],[44,"Gloom",["Grass"]],[45,"Vileplume",["Grass"]],
[46,"Paras",["Bug","Grass"]],[47,"Parasect",["Bug","Grass"]],
[48,"Venonat",["Bug"]],[49,"Venomoth",["Bug"]],
[50,"Diglett",["Field"]],[51,"Dugtrio",["Field"]],
[52,"Meowth",["Field"]],[53,"Persian",["Field"]],
[54,"Psyduck",["Water 1","Field"]],[55,"Golduck",["Water 1","Field"]],
[56,"Mankey",["Field"]],[57,"Primeape",["Field"]],
[58,"Growlithe",["Field"]],[59,"Arcanine",["Field"]],
[60,"Poliwag",["Water 1"]],[61,"Poliwhirl",["Water 1"]],[62,"Poliwrath",["Water 1"]],
[63,"Abra",["Human-Like"]],[64,"Kadabra",["Human-Like"]],[65,"Alakazam",["Human-Like"]],
[66,"Machop",["Human-Like"]],[67,"Machoke",["Human-Like"]],[68,"Machamp",["Human-Like"]],
[69,"Bellsprout",["Grass"]],[70,"Weepinbell",["Grass"]],[71,"Victreebel",["Grass"]],
[72,"Tentacool",["Water 3"]],[73,"Tentacruel",["Water 3"]],
[74,"Geodude",["Mineral"]],[75,"Graveler",["Mineral"]],[76,"Golem",["Mineral"]],
[77,"Ponyta",["Field"]],[78,"Rapidash",["Field"]],
[79,"Slowpoke",["Monster","Water 1"]],[80,"Slowbro",["Monster","Water 1"]],
[81,"Magnemite",["Mineral"]],[82,"Magneton",["Mineral"]],
[83,"Farfetch'd",["Flying","Field"]],
[84,"Doduo",["Flying"]],[85,"Dodrio",["Flying"]],
[86,"Seel",["Water 1","Field"]],[87,"Dewgong",["Water 1","Field"]],
[88,"Grimer",["Amorphous"]],[89,"Muk",["Amorphous"]],
[90,"Shellder",["Water 3"]],[91,"Cloyster",["Water 3"]],
[92,"Gastly",["Amorphous"]],[93,"Haunter",["Amorphous"]],[94,"Gengar",["Amorphous"]],
[95,"Onix",["Mineral"]],
[96,"Drowzee",["Human-Like"]],[97,"Hypno",["Human-Like"]],
[98,"Krabby",["Water 3"]],[99,"Kingler",["Water 3"]],
[100,"Voltorb",["Mineral"]],[101,"Electrode",["Mineral"]],
[102,"Exeggcute",["Grass"]],[103,"Exeggutor",["Grass"]],
[104,"Cubone",["Monster"]],[105,"Marowak",["Monster"]],
[106,"Hitmonlee",["Human-Like"]],[107,"Hitmonchan",["Human-Like"]],
[108,"Lickitung",["Monster"]],
[109,"Koffing",["Amorphous"]],[110,"Weezing",["Amorphous"]],
[111,"Rhyhorn",["Monster","Field"]],[112,"Rhydon",["Monster","Field"]],
[113,"Chansey",["Fairy"]],
[114,"Tangela",["Grass"]],
[115,"Kangaskhan",["Monster"]],
[116,"Horsea",["Water 1","Dragon"]],[117,"Seadra",["Water 1","Dragon"]],
[118,"Goldeen",["Water 2"]],[119,"Seaking",["Water 2"]],
[120,"Staryu",["Water 3"]],[121,"Starmie",["Water 3"]],
[122,"Mr. Mime",["Human-Like"]],
[123,"Scyther",["Bug"]],
[124,"Jynx",["Human-Like"]],
[125,"Electabuzz",["Human-Like"]],
[126,"Magmar",["Human-Like"]],
[127,"Pinsir",["Bug"]],
[128,"Tauros",["Field"]],
[129,"Magikarp",["Water 2","Dragon"]],[130,"Gyarados",["Water 2","Dragon"]],
[131,"Lapras",["Monster","Water 1"]],
[132,"Ditto",["Ditto"]],
[133,"Eevee",["Field"]],[134,"Vaporeon",["Field"]],[135,"Jolteon",["Field"]],[136,"Flareon",["Field"]],
[137,"Porygon",["Mineral"]],
[138,"Omanyte",["Water 1","Water 3"]],[139,"Omastar",["Water 1","Water 3"]],
[140,"Kabuto",["Water 1","Water 3"]],[141,"Kabutops",["Water 1","Water 3"]],
[142,"Aerodactyl",["Flying"]],
[143,"Snorlax",["Monster"]],
[144,"Articuno",["No Eggs"]],[145,"Zapdos",["No Eggs"]],[146,"Moltres",["No Eggs"]],
[147,"Dratini",["Water 1","Dragon"]],[148,"Dragonair",["Water 1","Dragon"]],[149,"Dragonite",["Water 1","Dragon"]],
[150,"Mewtwo",["No Eggs"]],[151,"Mew",["No Eggs"]]
];

const JOHTO_DEX = [
[152,"Chikorita",["Monster","Grass"]],[153,"Bayleef",["Monster","Grass"]],[154,"Meganium",["Monster","Grass"]],
[155,"Cyndaquil",["Field"]],[156,"Quilava",["Field"]],[157,"Typhlosion",["Field"]],
[158,"Totodile",["Monster","Water 1"]],[159,"Croconaw",["Monster","Water 1"]],[160,"Feraligatr",["Monster","Water 1"]],
[161,"Sentret",["Field"]],[162,"Furret",["Field"]],
[163,"Hoothoot",["Flying"]],[164,"Noctowl",["Flying"]],
[165,"Ledyba",["Bug"]],[166,"Ledian",["Bug"]],
[167,"Spinarak",["Bug"]],[168,"Ariados",["Bug"]],
[169,"Crobat",["Flying"]],
[170,"Chinchou",["Water 2"]],[171,"Lanturn",["Water 2"]],
[172,"Pichu",["No Eggs"]],
[173,"Cleffa",["No Eggs"]],
[174,"Igglybuff",["No Eggs"]],
[175,"Togepi",["No Eggs"]],[176,"Togetic",["Flying","Fairy"]],
[177,"Natu",["Flying"]],[178,"Xatu",["Flying"]],
[179,"Mareep",["Monster","Field"]],[180,"Flaaffy",["Monster","Field"]],[181,"Ampharos",["Monster","Field"]],
[182,"Bellossom",["Grass"]],
[183,"Marill",["Water 1","Fairy"]],[184,"Azumarill",["Water 1","Fairy"]],
[185,"Sudowoodo",["Mineral"]],
[186,"Politoed",["Water 1"]],
[187,"Hoppip",["Fairy","Grass"]],[188,"Skiploom",["Fairy","Grass"]],[189,"Jumpluff",["Fairy","Grass"]],
[190,"Aipom",["Field"]],
[191,"Sunkern",["Grass"]],[192,"Sunflora",["Grass"]],
[193,"Yanma",["Bug"]],
[194,"Wooper",["Water 1","Field"]],[195,"Quagsire",["Water 1","Field"]],
[196,"Espeon",["Field"]],[197,"Umbreon",["Field"]],
[198,"Murkrow",["Flying"]],
[199,"Slowking",["Monster","Water 1"]],
[200,"Misdreavus",["Amorphous"]],
[201,"Unown",["No Eggs"]],
[202,"Wobbuffet",["Amorphous"]],
[203,"Girafarig",["Field"]],
[204,"Pineco",["Bug"]],[205,"Forretress",["Bug"]],
[206,"Dunsparce",["Field"]],
[207,"Gligar",["Bug"]],
[208,"Steelix",["Mineral"]],
[209,"Snubbull",["Field","Fairy"]],[210,"Granbull",["Field","Fairy"]],
[211,"Qwilfish",["Water 2"]],
[212,"Scizor",["Bug"]],
[213,"Shuckle",["Bug"]],
[214,"Heracross",["Bug"]],
[215,"Sneasel",["Field"]],
[216,"Teddiursa",["Field"]],[217,"Ursaring",["Field"]],
[218,"Slugma",["Amorphous"]],[219,"Magcargo",["Amorphous"]],
[220,"Swinub",["Field"]],[221,"Piloswine",["Field"]],
[222,"Corsola",["Water 1","Water 3"]],
[223,"Remoraid",["Water 1","Water 2"]],[224,"Octillery",["Water 1","Water 2"]],
[225,"Delibird",["Water 1","Field"]],
[226,"Mantine",["Water 1"]],
[227,"Skarmory",["Flying"]],
[228,"Houndour",["Field"]],[229,"Houndoom",["Field"]],
[230,"Kingdra",["Water 1","Dragon"]],
[231,"Phanpy",["Field"]],[232,"Donphan",["Field"]],
[233,"Porygon2",["Mineral"]],
[234,"Stantler",["Field"]],
[235,"Smeargle",["Field"]],
[236,"Tyrogue",["No Eggs"]],
[237,"Hitmontop",["Human-Like"]],
[238,"Smoochum",["No Eggs"]],
[239,"Elekid",["No Eggs"]],
[240,"Magby",["No Eggs"]],
[241,"Miltank",["Field"]],
[242,"Blissey",["Fairy"]],
[243,"Raikou",["No Eggs"]],[244,"Entei",["No Eggs"]],[245,"Suicune",["No Eggs"]],
[246,"Larvitar",["Monster"]],[247,"Pupitar",["Monster"]],[248,"Tyranitar",["Monster"]],
[249,"Lugia",["No Eggs"]],[250,"Ho-Oh",["No Eggs"]],[251,"Celebi",["No Eggs"]]
];

const HOENN_DEX = [
[252,"Treecko",["Monster","Dragon"]],[253,"Grovyle",["Monster","Dragon"]],[254,"Sceptile",["Monster","Dragon"]],
[255,"Torchic",["Field"]],[256,"Combusken",["Field"]],[257,"Blaziken",["Field"]],
[258,"Mudkip",["Monster","Water 1"]],[259,"Marshtomp",["Monster","Water 1"]],[260,"Swampert",["Monster","Water 1"]],
[261,"Poochyena",["Field"]],[262,"Mightyena",["Field"]],
[263,"Zigzagoon",["Field"]],[264,"Linoone",["Field"]],
[265,"Wurmple",["Bug"]],[266,"Silcoon",["Bug"]],[267,"Beautifly",["Bug"]],
[268,"Cascoon",["Bug"]],[269,"Dustox",["Bug"]],
[270,"Lotad",["Water 1","Grass"]],[271,"Lombre",["Water 1","Grass"]],[272,"Ludicolo",["Water 1","Grass"]],
[273,"Seedot",["Field","Grass"]],[274,"Nuzleaf",["Field","Grass"]],[275,"Shiftry",["Field","Grass"]],
[276,"Taillow",["Flying"]],[277,"Swellow",["Flying"]],
[278,"Wingull",["Water 1","Flying"]],[279,"Pelipper",["Water 1","Flying"]],
[280,"Ralts",["Amorphous"]],[281,"Kirlia",["Amorphous"]],[282,"Gardevoir",["Amorphous"]],
[283,"Surskit",["Water 1","Bug"]],[284,"Masquerain",["Water 1","Bug"]],
[285,"Shroomish",["Fairy","Grass"]],[286,"Breloom",["Fairy","Grass"]],
[287,"Slakoth",["Field"]],[288,"Vigoroth",["Field"]],[289,"Slaking",["Field"]],
[290,"Nincada",["Bug"]],[291,"Ninjask",["Bug"]],[292,"Shedinja",["Mineral"]],
[293,"Whismur",["Monster","Field"]],[294,"Loudred",["Monster","Field"]],[295,"Exploud",["Monster","Field"]],
[296,"Makuhita",["Human-Like"]],[297,"Hariyama",["Human-Like"]],
[298,"Azurill",["No Eggs"]],
[299,"Nosepass",["Mineral"]],
[300,"Skitty",["Field","Fairy"]],[301,"Delcatty",["Field","Fairy"]],
[302,"Sableye",["Human-Like"]],
[303,"Mawile",["Field","Fairy"]],
[304,"Aron",["Monster"]],[305,"Lairon",["Monster"]],[306,"Aggron",["Monster"]],
[307,"Meditite",["Human-Like"]],[308,"Medicham",["Human-Like"]],
[309,"Electrike",["Field"]],[310,"Manectric",["Field"]],
[311,"Plusle",["Fairy"]],[312,"Minun",["Fairy"]],
[313,"Volbeat",["Bug","Human-Like"]],[314,"Illumise",["Bug","Human-Like"]],
[315,"Roselia",["Fairy","Grass"]],
[316,"Gulpin",["Amorphous"]],[317,"Swalot",["Amorphous"]],
[318,"Carvanha",["Water 2"]],[319,"Sharpedo",["Water 2"]],
[320,"Wailmer",["Field","Water 2"]],[321,"Wailord",["Field","Water 2"]],
[322,"Numel",["Field"]],[323,"Camerupt",["Field"]],
[324,"Torkoal",["Field"]],
[325,"Spoink",["Field"]],[326,"Grumpig",["Field"]],
[327,"Spinda",["Field","Human-Like"]],
[328,"Trapinch",["Bug"]],[329,"Vibrava",["Bug"]],[330,"Flygon",["Bug"]],
[331,"Cacnea",["Grass","Human-Like"]],[332,"Cacturne",["Grass","Human-Like"]],
[333,"Swablu",["Flying","Dragon"]],[334,"Altaria",["Flying","Dragon"]],
[335,"Zangoose",["Field"]],
[336,"Seviper",["Field","Dragon"]],
[337,"Lunatone",["Mineral"]],[338,"Solrock",["Mineral"]],
[339,"Barboach",["Water 2"]],[340,"Whiscash",["Water 2"]],
[341,"Corphish",["Water 1","Water 3"]],[342,"Crawdaunt",["Water 1","Water 3"]],
[343,"Baltoy",["Mineral"]],[344,"Claydol",["Mineral"]],
[345,"Lileep",["Water 3"]],[346,"Cradily",["Water 3"]],
[347,"Anorith",["Water 3"]],[348,"Armaldo",["Water 3"]],
[349,"Feebas",["Water 1","Dragon"]],[350,"Milotic",["Water 1","Dragon"]],
[351,"Castform",["Fairy","Amorphous"]],
[352,"Kecleon",["Field"]],
[353,"Shuppet",["Amorphous"]],[354,"Banette",["Amorphous"]],
[355,"Duskull",["Amorphous"]],[356,"Dusclops",["Amorphous"]],
[357,"Tropius",["Monster","Grass"]],
[358,"Chimecho",["Amorphous"]],
[359,"Absol",["Field"]],
[360,"Wynaut",["No Eggs"]],
[361,"Snorunt",["Fairy","Mineral"]],[362,"Glalie",["Fairy","Mineral"]],
[363,"Spheal",["Water 1","Field"]],[364,"Sealeo",["Water 1","Field"]],[365,"Walrein",["Water 1","Field"]],
[366,"Clamperl",["Water 1"]],[367,"Huntail",["Water 1"]],[368,"Gorebyss",["Water 1"]],
[369,"Relicanth",["Water 1","Water 2"]],
[370,"Luvdisc",["Water 2"]],
[371,"Bagon",["Dragon"]],[372,"Shelgon",["Dragon"]],[373,"Salamence",["Dragon"]],
[374,"Beldum",["Mineral"]],[375,"Metang",["Mineral"]],[376,"Metagross",["Mineral"]],
[377,"Regirock",["No Eggs"]],[378,"Regice",["No Eggs"]],[379,"Registeel",["No Eggs"]],
[380,"Latias",["No Eggs"]],[381,"Latios",["No Eggs"]],
[382,"Kyogre",["No Eggs"]],[383,"Groudon",["No Eggs"]],[384,"Rayquaza",["No Eggs"]],
[385,"Jirachi",["No Eggs"]],[386,"Deoxys",["No Eggs"]]
];

const SINNOH_DEX = [
[387,"Turtwig",["Monster","Grass"]],[388,"Grotle",["Monster","Grass"]],[389,"Torterra",["Monster","Grass"]],
[390,"Chimchar",["Field","Human-Like"]],[391,"Monferno",["Field","Human-Like"]],[392,"Infernape",["Field","Human-Like"]],
[393,"Piplup",["Water 1","Field"]],[394,"Prinplup",["Water 1","Field"]],[395,"Empoleon",["Water 1","Field"]],
[396,"Starly",["Flying"]],[397,"Staravia",["Flying"]],[398,"Staraptor",["Flying"]],
[399,"Bidoof",["Water 1","Field"]],[400,"Bibarel",["Water 1","Field"]],
[401,"Kricketot",["Bug"]],[402,"Kricketune",["Bug"]],
[403,"Shinx",["Field"]],[404,"Luxio",["Field"]],[405,"Luxray",["Field"]],
[406,"Budew",["No Eggs"]],
[407,"Roserade",["Fairy","Grass"]],
[408,"Cranidos",["Monster"]],[409,"Rampardos",["Monster"]],
[410,"Shieldon",["Monster"]],[411,"Bastiodon",["Monster"]],
[412,"Burmy",["Bug"]],[413,"Wormadam",["Bug"]],[414,"Mothim",["Bug"]],
[415,"Combee",["Bug"]],[416,"Vespiquen",["Bug"]],
[417,"Pachirisu",["Field","Fairy"]],
[418,"Buizel",["Water 1","Field"]],[419,"Floatzel",["Water 1","Field"]],
[420,"Cherubi",["Fairy","Grass"]],[421,"Cherrim",["Fairy","Grass"]],
[422,"Shellos",["Water 1","Amorphous"]],[423,"Gastrodon",["Water 1","Amorphous"]],
[424,"Ambipom",["Field"]],
[425,"Drifloon",["Amorphous"]],[426,"Drifblim",["Amorphous"]],
[427,"Buneary",["Field","Human-Like"]],[428,"Lopunny",["Field","Human-Like"]],
[429,"Mismagius",["Amorphous"]],
[430,"Honchkrow",["Flying"]],
[431,"Glameow",["Field"]],[432,"Purugly",["Field"]],
[433,"Chingling",["No Eggs"]],
[434,"Stunky",["Field"]],[435,"Skuntank",["Field"]],
[436,"Bronzor",["Mineral"]],[437,"Bronzong",["Mineral"]],
[438,"Bonsly",["No Eggs"]],
[439,"Mime Jr.",["No Eggs"]],
[440,"Happiny",["No Eggs"]],
[441,"Chatot",["Flying"]],
[442,"Spiritomb",["Amorphous"]],
[443,"Gible",["Monster","Dragon"]],[444,"Gabite",["Monster","Dragon"]],[445,"Garchomp",["Monster","Dragon"]],
[446,"Munchlax",["No Eggs"]],
[447,"Riolu",["No Eggs"]],[448,"Lucario",["Field","Human-Like"]],
[449,"Hippopotas",["Field"]],[450,"Hippowdon",["Field"]],
[451,"Skorupi",["Bug","Water 3"]],[452,"Drapion",["Bug","Water 3"]],
[453,"Croagunk",["Human-Like"]],[454,"Toxicroak",["Human-Like"]],
[455,"Carnivine",["Grass"]],
[456,"Finneon",["Water 2"]],[457,"Lumineon",["Water 2"]],
[458,"Mantyke",["No Eggs"]],
[459,"Snover",["Monster","Grass"]],[460,"Abomasnow",["Monster","Grass"]],
[461,"Weavile",["Field"]],
[462,"Magnezone",["Mineral"]],
[463,"Lickilicky",["Monster"]],
[464,"Rhyperior",["Monster","Field"]],
[465,"Tangrowth",["Grass"]],
[466,"Electivire",["Human-Like"]],
[467,"Magmortar",["Human-Like"]],
[468,"Togekiss",["Flying","Fairy"]],
[469,"Yanmega",["Bug"]],
[470,"Leafeon",["Field"]],[471,"Glaceon",["Field"]],
[472,"Gliscor",["Bug"]],
[473,"Mamoswine",["Field"]],
[474,"Porygon-Z",["Mineral"]],
[475,"Gallade",["Amorphous"]],
[476,"Probopass",["Mineral"]],
[477,"Dusknoir",["Amorphous"]],
[478,"Froslass",["Fairy","Mineral"]],
[479,"Rotom",["Amorphous"]],
[480,"Uxie",["No Eggs"]],[481,"Mesprit",["No Eggs"]],[482,"Azelf",["No Eggs"]],
[483,"Dialga",["No Eggs"]],[484,"Palkia",["No Eggs"]],
[485,"Heatran",["No Eggs"]],
[486,"Regigigas",["No Eggs"]],
[487,"Giratina",["No Eggs"]],
[488,"Cresselia",["No Eggs"]],
[489,"Phione",["Water 1","Fairy"]],[490,"Manaphy",["Water 1","Fairy"]],
[491,"Darkrai",["No Eggs"]],
[492,"Shaymin",["No Eggs"]],
[493,"Arceus",["No Eggs"]]
];

const TESELIA_DEX = [
[494,"Victini",["No Eggs"]],
[495,"Snivy",["Field","Grass"]],[496,"Servine",["Field","Grass"]],[497,"Serperior",["Field","Grass"]],
[498,"Tepig",["Field"]],[499,"Pignite",["Field"]],[500,"Emboar",["Field"]],
[501,"Oshawott",["Field"]],[502,"Dewott",["Field"]],[503,"Samurott",["Field"]],
[504,"Patrat",["Field"]],[505,"Watchog",["Field"]],
[506,"Lillipup",["Field"]],[507,"Herdier",["Field"]],[508,"Stoutland",["Field"]],
[509,"Purrloin",["Field"]],[510,"Liepard",["Field"]],
[511,"Pansage",["Field"]],[512,"Simisage",["Field"]],
[513,"Pansear",["Field"]],[514,"Simisear",["Field"]],
[515,"Panpour",["Field"]],[516,"Simipour",["Field"]],
[517,"Munna",["Field"]],[518,"Musharna",["Field"]],
[519,"Pidove",["Flying"]],[520,"Tranquill",["Flying"]],[521,"Unfezant",["Flying"]],
[522,"Blitzle",["Field"]],[523,"Zebstrika",["Field"]],
[524,"Roggenrola",["Mineral"]],[525,"Boldore",["Mineral"]],[526,"Gigalith",["Mineral"]],
[527,"Woobat",["Field","Flying"]],[528,"Swoobat",["Field","Flying"]],
[529,"Drilbur",["Field"]],[530,"Excadrill",["Field"]],
[531,"Audino",["Fairy"]],
[532,"Timburr",["Human-Like"]],[533,"Gurdurr",["Human-Like"]],[534,"Conkeldurr",["Human-Like"]],
[535,"Tympole",["Water 1"]],[536,"Palpitoad",["Water 1"]],[537,"Seismitoad",["Water 1"]],
[538,"Throh",["Human-Like"]],[539,"Sawk",["Human-Like"]],
[540,"Sewaddle",["Bug"]],[541,"Swadloon",["Bug"]],[542,"Leavanny",["Bug"]],
[543,"Venipede",["Bug"]],[544,"Whirlipede",["Bug"]],[545,"Scolipede",["Bug"]],
[546,"Cottonee",["Fairy","Grass"]],[547,"Whimsicott",["Fairy","Grass"]],
[548,"Petilil",["Grass"]],[549,"Lilligant",["Grass"]],
[550,"Basculin",["Water 2"]],
[551,"Sandile",["Field"]],[552,"Krokorok",["Field"]],[553,"Krookodile",["Field"]],
[554,"Darumaka",["Field"]],[555,"Darmanitan",["Field"]],
[556,"Maractus",["Grass"]],
[557,"Dwebble",["Bug","Mineral"]],[558,"Crustle",["Bug","Mineral"]],
[559,"Scraggy",["Field","Dragon"]],[560,"Scrafty",["Field","Dragon"]],
[561,"Sigilyph",["Flying"]],
[562,"Yamask",["Mineral","Amorphous"]],[563,"Cofagrigus",["Mineral","Amorphous"]],
[564,"Tirtouga",["Water 1","Water 3"]],[565,"Carracosta",["Water 1","Water 3"]],
[566,"Archen",["Flying","Water 3"]],[567,"Archeops",["Flying","Water 3"]],
[568,"Trubbish",["Mineral"]],[569,"Garbodor",["Mineral"]],
[570,"Zorua",["Field"]],[571,"Zoroark",["Field"]],
[572,"Minccino",["Field"]],[573,"Cinccino",["Field"]],
[574,"Gothita",["Human-Like"]],[575,"Gothorita",["Human-Like"]],[576,"Gothitelle",["Human-Like"]],
[577,"Solosis",["Amorphous"]],[578,"Duosion",["Amorphous"]],[579,"Reuniclus",["Amorphous"]],
[580,"Ducklett",["Water 1","Flying"]],[581,"Swanna",["Water 1","Flying"]],
[582,"Vanillite",["Mineral"]],[583,"Vanillish",["Mineral"]],[584,"Vanilluxe",["Mineral"]],
[585,"Deerling",["Field"]],[586,"Sawsbuck",["Field"]],
[587,"Emolga",["Field"]],
[588,"Karrablast",["Bug"]],[589,"Escavalier",["Bug"]],
[590,"Foongus",["Grass"]],[591,"Amoonguss",["Grass"]],
[592,"Frillish",["Amorphous"]],[593,"Jellicent",["Amorphous"]],
[594,"Alomomola",["Water 1","Water 2"]],
[595,"Joltik",["Bug"]],[596,"Galvantula",["Bug"]],
[597,"Ferroseed",["Grass","Mineral"]],[598,"Ferrothorn",["Grass","Mineral"]],
[599,"Klink",["Mineral"]],[600,"Klang",["Mineral"]],[601,"Klinklang",["Mineral"]],
[602,"Tynamo",["Amorphous"]],[603,"Eelektrik",["Amorphous"]],[604,"Eelektross",["Amorphous"]],
[605,"Elgyem",["Human-Like"]],[606,"Beheeyem",["Human-Like"]],
[607,"Litwick",["Amorphous"]],[608,"Lampent",["Amorphous"]],[609,"Chandelure",["Amorphous"]],
[610,"Axew",["Monster","Dragon"]],[611,"Fraxure",["Monster","Dragon"]],[612,"Haxorus",["Monster","Dragon"]],
[613,"Cubchoo",["Field"]],[614,"Beartic",["Field"]],
[615,"Cryogonal",["Mineral"]],
[616,"Shelmet",["Bug"]],[617,"Accelgor",["Bug"]],
[618,"Stunfisk",["Water 1","Amorphous"]],
[619,"Mienfoo",["Field","Human-Like"]],[620,"Mienshao",["Field","Human-Like"]],
[621,"Druddigon",["Dragon","Monster"]],
[622,"Golett",["Mineral"]],[623,"Golurk",["Mineral"]],
[624,"Pawniard",["Human-Like"]],[625,"Bisharp",["Human-Like"]],
[626,"Bouffalant",["Field"]],
[627,"Rufflet",["Flying"]],[628,"Braviary",["Flying"]],
[629,"Vullaby",["Flying"]],[630,"Mandibuzz",["Flying"]],
[631,"Heatmor",["Field"]],
[632,"Durant",["Bug"]],
[633,"Deino",["Dragon"]],[634,"Zweilous",["Dragon"]],[635,"Hydreigon",["Dragon"]],
[636,"Larvesta",["Bug"]],[637,"Volcarona",["Bug"]],
[638,"Cobalion",["No Eggs"]],[639,"Terrakion",["No Eggs"]],[640,"Virizion",["No Eggs"]],
[641,"Tornadus",["No Eggs"]],[642,"Thundurus",["No Eggs"]],[643,"Reshiram",["No Eggs"]],
[644,"Zekrom",["No Eggs"]],[645,"Landorus",["No Eggs"]],
[646,"Kyurem",["No Eggs"]],
[647,"Keldeo",["No Eggs"]],[648,"Meloetta",["No Eggs"]],[649,"Genesect",["No Eggs"]]
];

const NATURES = [
{name:"Adamant",nameEs:"Firme",boost:"atk",reduce:"spa"},
{name:"Bashful",nameEs:"Tímida",boost:null,reduce:null},
{name:"Bold",nameEs:"Osada",boost:"def",reduce:"atk"},
{name:"Brave",nameEs:"Audaz",boost:"atk",reduce:"spe"},
{name:"Calm",nameEs:"Serena",boost:"spd",reduce:"atk"},
{name:"Careful",nameEs:"Cauta",boost:"spd",reduce:"spa"},
{name:"Docile",nameEs:"Dócil",boost:null,reduce:null},
{name:"Gentle",nameEs:"Amable",boost:"spd",reduce:"def"},
{name:"Hardy",nameEs:"Fuerte",boost:null,reduce:null},
{name:"Hasty",nameEs:"Activa",boost:"spe",reduce:"def"},
{name:"Impish",nameEs:"Agitada",boost:"def",reduce:"spa"},
{name:"Jolly",nameEs:"Alegre",boost:"spe",reduce:"spa"},
{name:"Lax",nameEs:"Floja",boost:"def",reduce:"spd"},
{name:"Lonely",nameEs:"Huraña",boost:"atk",reduce:"def"},
{name:"Mild",nameEs:"Afable",boost:"spa",reduce:"def"},
{name:"Modest",nameEs:"Modesta",boost:"spa",reduce:"atk"},
{name:"Naive",nameEs:"Ingenua",boost:"spe",reduce:"spd"},
{name:"Naughty",nameEs:"Pícara",boost:"atk",reduce:"spd"},
{name:"Quiet",nameEs:"Mansa",boost:"spa",reduce:"spe"},
{name:"Quirky",nameEs:"Rara",boost:null,reduce:null},
{name:"Rash",nameEs:"Alocada",boost:"spa",reduce:"spd"},
{name:"Relaxed",nameEs:"Plácida",boost:"def",reduce:"spe"},
{name:"Sassy",nameEs:"Grosera",boost:"spd",reduce:"spe"},
{name:"Serious",nameEs:"Seria",boost:null,reduce:null},
{name:"Timid",nameEs:"Miedosa",boost:"spe",reduce:"atk"}
];

const STAT_NAMES = {
    hp: "HP", atk: "Ataque", def: "Defensa",
    spa: "At. Especial", spd: "Def. Especial", spe: "Velocidad"
};

const POWER_ITEMS = {
    hp:  { name: "Pesa Recia", nameEn: "Power Weight", emoji: "🏋️" },
    atk: { name: "Brazal Recio", nameEn: "Power Bracer", emoji: "💪" },
    def: { name: "Cinto Recio", nameEn: "Power Belt", emoji: "🛡️" },
    spa: { name: "Lente Recia", nameEn: "Power Lens", emoji: "🔍" },
    spd: { name: "Banda Recia", nameEn: "Power Band", emoji: "📿" },
    spe: { name: "Tobillera Recia", nameEn: "Power Anklet", emoji: "👟" }
};

const ALL_POKEMON = [...KANTO_DEX, ...JOHTO_DEX, ...HOENN_DEX, ...SINNOH_DEX, ...TESELIA_DEX];

function getPokemonSpriteUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

/**
 * Find all Pokémon compatible for breeding with the given Pokémon.
 * Two Pokémon can breed if they share at least one Egg Group (excluding "No Eggs").
 * Ditto can breed with anything (except "No Eggs" and other Ditto).
 * Returns: { byGroup: { groupName: [pokemon...] }, ditto: pokemonEntry|null, totalCount: number }
 */
function getCompatiblePokemon(pokemon) {
    const selectedId = pokemon[0];
    const selectedGroups = pokemon[2];

    // "No Eggs" can't breed at all
    if (selectedGroups.includes("No Eggs")) {
        return { byGroup: {}, ditto: null, totalCount: 0 };
    }

    const isDitto = selectedGroups.includes("Ditto");
    const compatibleMap = {}; // groupName -> Set of pokemon IDs to avoid duplicates
    const compatiblePokemon = {}; // groupName -> pokemon array
    let dittoEntry = null;
    const seenIds = new Set();

    ALL_POKEMON.forEach(poke => {
        if (poke[0] === selectedId) return; // skip self
        if (poke[2].includes("No Eggs")) return; // legendaries can't breed

        // If selected is Ditto, it can breed with anything except other Ditto
        if (isDitto) {
            if (!poke[2].includes("Ditto")) {
                poke[2].forEach(group => {
                    if (!compatiblePokemon[group]) compatiblePokemon[group] = [];
                    if (!seenIds.has(poke[0] + '_' + group)) {
                        compatiblePokemon[group].push(poke);
                        seenIds.add(poke[0] + '_' + group);
                    }
                });
            }
            return;
        }

        // Ditto is always compatible
        if (poke[2].includes("Ditto")) {
            dittoEntry = poke;
            return;
        }

        // Check shared egg groups
        const sharedGroups = selectedGroups.filter(g => poke[2].includes(g) && g !== "Ditto");
        if (sharedGroups.length > 0) {
            sharedGroups.forEach(group => {
                if (!compatiblePokemon[group]) compatiblePokemon[group] = [];
                if (!seenIds.has(poke[0] + '_' + group)) {
                    compatiblePokemon[group].push(poke);
                    seenIds.add(poke[0] + '_' + group);
                }
            });
        }
    });

    // Count unique pokemon
    const uniqueIds = new Set();
    Object.values(compatiblePokemon).forEach(list => {
        list.forEach(p => uniqueIds.add(p[0]));
    });
    if (dittoEntry) uniqueIds.add(dittoEntry[0]);

    return {
        byGroup: compatiblePokemon,
        ditto: dittoEntry,
        totalCount: uniqueIds.size
    };
}
