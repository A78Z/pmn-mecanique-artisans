export type Commune = string;
export type Departement = {
    name: string;
    communes: Commune[];
};
export type Region = {
    name: string;
    departements: Departement[];
};

export const AL_SENEGAL_LOCATIONS: Region[] = [
    {
        name: "Dakar",
        departements: [
            {
                name: "Dakar",
                communes: ["Gorée", "Dakar-Plateau", "Médina", "Gueule Tapée-Fass-Colobane", "Fann-Point E-Amitié", "Grand Dakar", "Biscuiterie", "Dieuppeul-Derklé", "Hann-Bel Air", "HLM", "Sicap-Liberté", "Mermoz-Sacré Cœur", "Ngor", "Ouakam", "Yoff", "Cambérène", "Parcelles Assainies", "Patte d'Oie", "Grand Yoff"]
            },
            {
                name: "Pikine",
                communes: ["Pikine Est", "Pikine Nord", "Pikine Ouest", "Dalifort", "Djiddah Thiaroye Kao", "Guinaw Rail Nord", "Guinaw Rail Sud", "Keur Massar", "Mbao", "Thiaroye-Gare", "Thiaroye-sur-Mer", "Tivaouane Diacksao", "Yeumbeul Nord", "Yeumbeul Sud", "Malika", "Keur Massar Nord", "Keur Massar Sud"]
            },
            {
                name: "Guédiawaye",
                communes: ["Golf Sud", "Médina Gounass", "Ndiarème Limamoulaye", "Sam Notaire", "Wakhinane Nimzatt"]
            },
            {
                name: "Rufisque",
                communes: ["Rufisque Est", "Rufisque Nord", "Rufisque Ouest", "Bargny", "Sébikotane", "Diamniadio", "Jaxe", "Sangalkam", "Sendou", "Yène", "Bambilor", "Tivaouane Peulh-Niaga"]
            }
        ]
    },
    {
        name: "Diourbel",
        departements: [
            {
                name: "Diourbel",
                communes: ["Diourbel", "Dankh Sene", "Gatou", "Keur Ngal Gouye", "Ndanty", "Ndoulo", "Ngohe", "Patar", "Tocky Gare", "Touré Mbonde", "Toure Mbonde"]
            },
            {
                name: "Bambey",
                communes: ["Bambey", "Baba Garage", "Dinguiraye", "Gawane", "Keur Samba Kane", "Lambaye", "Ngogom", "Ngoye", "Refane", "Thiakhar", "Bambey Sérère", "Ndondol"]
            },
            {
                name: "Mbacké",
                communes: ["Mbacké", "Touba Mosquée", "Dalla Ngabou", "Dandeye", "Darou Nahim", "Darou Salam Typ", "Kaël", "Madina", "Missirah", "Ndioumane", "Nghayakh", "Sadio", "Taïba Thiékène", "Touba Fall", "Touba Mboul"]
            }
        ]
    },
    {
        name: "Thiès",
        departements: [
            {
                name: "Thiès",
                communes: ["Thiès Est", "Thiès Nord", "Thiès Ouest", "Kayar", "Khombole", "Pout", "Diender", "Fandène", "Keur Mousseu", "Notto", "Tassette", "Thiénaba", "Touba Toul", "Ngoundiane", "Ndiéyène Sirakh"]
            },
            {
                name: "Mbour",
                communes: ["Mbour", "Joal-Fadiouth", "Nguékhokh", "Popenguine", "Saly Portudal", "Ngaparou", "Somone", "Diass", "Fissel", "Malicounda", "Ndiaganiao", "Nguéniène", "Sindia", "Sessene"]
            },
            {
                name: "Tivaouane",
                communes: ["Tivaouane", "Méouane", "Mboro", "Mbayène", "Mont-Rolland", "Notto Gouye Diama", "Pambal", "Pire Goureye", "Cherif Lo", "Darou Khoudoss", "Koul", "Mékhé", "Ngandiouf", "Niakhène", "Pékèsse", "Taïba Ndiaye", "Thilmakha"]
            }
        ]
    },
    {
        name: "Saint-Louis",
        departements: [
            {
                name: "Saint-Louis",
                communes: ["Saint-Louis", "Mpal", "Fass Ngom", "Gandon", "Ndiébène Gandiol"]
            },
            {
                name: "Dagana",
                communes: ["Dagana", "Richard-Toll", "Rosso-Sénégal", "Gaé", "Ross Béthio", "Bokhol", "Diama", "Mbane", "Ndombo Sandjiry", "Ronkh", "Gnith"]
            },
            {
                name: "Podor",
                communes: ["Podor", "Ndioum", "Golléré", "Mboumba", "Aéré Lao", "Bodé Lao", "Demette", "Galoya Toucouleur", "Guédé Chantier", "Pété", "Walaldé", "Fanaye", "Gamadji Saré", "Guédé Village", "Madina Ndiathbé", "Méry", "Ndiayène Pendao", "Dodel", "Doumga Lao"]
            }
        ]
    },
    {
        name: "Fatick",
        departements: [
            {
                name: "Fatick",
                communes: ["Fatick", "Diakhao", "Diofior", "Diaule", "Djilasse", "Fimela", "Loul Sessene", "Mbellacadiao", "Ndiob", "Ngayokhem", "Niakhar", "Patar", "Tattaguine", "Thiare Ndiaye"]
            },
            {
                name: "Foundiougne",
                communes: ["Foundiougne", "Karang Poste", "Passy", "Sokone", "Soum", "Diagane Barka", "Dionewar", "Djirnda", "Keur Saloum Diané", "Keur Samba Gueye", "Mbam", "Niodior", "Toubacouta", "Diossong", "Bassoul"]
            },
            {
                name: "Gossas",
                communes: ["Gossas", "Colobane", "Mbar", "Ndiene Lagane", "Ouadiour", "Patoume"]
            }
        ]
    },
    {
        name: "Kaolack",
        departements: [
            {
                name: "Kaolack",
                communes: ["Kaolack", "Gandiaye", "Kahone", "Ndoffane", "Dya", "Keur Baka", "Keur Socé", "Latmingué", "Ndiébel", "Ndiedieng", "Thiaré"]
            },
            {
                name: "Guinguinéo",
                communes: ["Guinguinéo", "Fass", "Khelcom Birane", "Mbadakhoune", "Ndiago", "Ngathie Naoudé", "Ourour", "Panal Wolof", "Dara Mboss"]
            },
            {
                name: "Nioro du Rip",
                communes: ["Nioro du Rip", "Keur Madiabel", "Darou Salam", "Gaint Pathé", "Keur Mandongo", "Keur Mboucki", "Kaymor", "Médina Sabakh", "Ngayène", "Paoskoto", "Porokhane", "Taïba Niassène", "Wack Ngouna", "Dabaly", "Ndramé Escale"]
            }
        ]
    },
    {
        name: "Kaffrine",
        departements: [
            {
                name: "Kaffrine",
                communes: ["Kaffrine", "Nganda", "Boulel", "Diamal", "Diokoul Mbelbouck", "Gniby", "Kahi", "Kathiotte", "Medinatoul Salam II"]
            },
            {
                name: "Birkelane",
                communes: ["Birkelane", "Keur Mbouki", "Diamal", "Mabo", "Ndiognick", "Segre Gatta"]
            },
            {
                name: "Koungheul",
                communes: ["Koungheul", "Fass Thiekene", "Ida Mouride", "Lour Escale", "Maka Yop", "Ribot Escale", "Saly Escale", "Gainthe Pathé", "Missirah Wadene"]
            },
            {
                name: "Malem Hodar",
                communes: ["Malem Hodar", "Darou Minam 2", "Djounki", "Khelcom", "Ndioum Ngainth", "Ndoungou Kebé", "Sagna"]
            }
        ]
    },
    {
        name: "Louga",
        departements: [
            {
                name: "Louga",
                communes: ["Louga", "Ndiagne", "Gandiaye", "Keur Momar Sarr", "Leona", "Nguer Malal", "Niomre", "Pambal", "Potou", "Sakal"]
            },
            {
                name: "Kébémer",
                communes: ["Kébémer", "Guéoul", "Ndande", "Bandegne Ouolof", "Darou Marnane", "Darou Mousty", "Diokoul Diawrigne", "Kab Gaye", "Kanene Ndiob", "Loro", "Mbacké Cajor", "Mbadiane", "Ndoyene", "Ngourane", "Sagatta Gueth", "Sam Yabal", "Thieppe", "Touba Mérina"]
            },
            {
                name: "Linguère",
                communes: ["Linguère", "Dahra", "Mbeuleukhé", "Barkeji", "Boulal", "Deali", "Dodji", "Gassane", "Kamb", "Labgar", "Mboula", "Ouarkhokh", "Rao", "Sagatta Dioloff", "Tessékéré", "Thiamène Pass", "Thiargny", "Thiel", "Yang-Yang"]
            }
        ]
    },
    {
        name: "Matam",
        departements: [
            {
                name: "Matam",
                communes: ["Matam", "Ourossogui", "Thilogne", "Bokidiawé", "Dabia", "Nabadji Civol", "Ogo", "Nguidjilone"]
            },
            {
                name: "Kanel",
                communes: ["Kanel", "Dembancané", "Hamady Hounaré", "Odobéré", "Semmé", "Sinthiou Bamambé-Banadji", "Waoundé", "Aouré", "Bokiladji", "Ndendory", "Orkadiere", "Wouro Sidy"]
            },
            {
                name: "Ranérou",
                communes: ["Ranérou", "Lougré Thioly", "Oudalaye", "Vélingara"]
            }
        ]
    },
    {
        name: "Tambacounda",
        departements: [
            {
                name: "Tambacounda",
                communes: ["Tambacounda", "Dialacoto", "Koussanar", "Maka Colibantang", "Missirah", "Ndoga Babacar", "Nettéboulou", "Niani Toucouleur", "Sinthiou Malème"]
            },
            {
                name: "Bakel",
                communes: ["Bakel", "Diawara", "Kidira", "Ballou", "Bélé", "Gabou", "Gathiary", "Madina Foulbé", "Moudéry", "Sadatou", "Sinthiou Fissa", "Toumboura"]
            },
            {
                name: "Goudiry",
                communes: ["Goudiry", "Kothiary", "Bala", "Bani Israël", "Boynguel Bamba", "Dianke Makha", "Dougué", "Goumbayel", "Koar", "Komoti", "Koulor", "Sinthiou Bocar Aly", "Sinthiou Mamadou Boubou"]
            },
            {
                name: "Koumpentoum",
                communes: ["Koumpentoum", "Malem Niani", "Bamba Thialene", "Kahène", "Kouthiaba Wolof", "Mereto", "Ndam", "Pass Koto", "Payar"]
            }
        ]
    },
    {
        name: "Kédougou",
        departements: [
            {
                name: "Kédougou",
                communes: ["Kédougou", "Bandafassi", "Dindefello", "Fongolimbi", "Ninéfécha", "Tomboronkoto"]
            },
            {
                name: "Salémata",
                communes: ["Salémata", "Dakately", "Dar Salam", "Ethiolo", "Kévoye", "Oubadji"]
            },
            {
                name: "Saraya",
                communes: ["Saraya", "Bembou", "Khossanto", "Médina Baffé", "Missirah Sirimana", "Sabodala"]
            }
        ]
    },
    {
        name: "Kolda",
        departements: [
            {
                name: "Kolda",
                communes: ["Kolda", "Dabo", "Sare Yoba Diega", "Salikngne", "Bagadadji", "Coumbacara", "Dioulacolon", "Guiro Yero Bocar", "Mampatim", "Medina Cherif", "Medina El Hadj", "Sare Bidji", "Tankanto Escale", "Thietty"]
            },
            {
                name: "Vélingara",
                communes: ["Vélingara", "Kounkané", "Diaobé-Kabendou", "Bonconto", "Kandia", "Klinkill", "Linkéring", "Médina Gounass", "Nemataba", "Ouassadou", "Pakour", "Paroumba", "Saré Coly Sallé", "Sinthiang Koundara"]
            },
            {
                name: "Médina Yoro Foulah",
                communes: ["Médina Yoro Foulah", "Pata", "Badion", "Bignarabé", "Bourouco", "Dinguiraye", "Fafacourou", "Kerewane", "Koulinto", "Niaming", "Ndorna"]
            }
        ]
    },
    {
        name: "Sédhiou",
        departements: [
            {
                name: "Sédhiou",
                communes: ["Sédhiou", "Diannah Malary", "Marsassoum", "Bambali", "Benet", "Diatta Counda", "Diendé", "Djibabouya", "Koussy", "Sakar", "Sama Kanta Peulh", "Same Kanta"]
            },
            {
                name: "Bounkiling",
                communes: ["Bounkiling", "Madina Wandifa", "Ndiama", "Boghale", "Bona", "Diacounda", "Diambre", "Diaroume", "Djibanar", "Faoune", "Inor", "Kandion Mangana", "Tankon"]
            },
            {
                name: "Goudomp",
                communes: ["Goudomp", "Diattacounda", "Samy", "Tanaff", "Baginère", "Dioudoubou", "Djibanar", "Kaour", "Karantaba", "Kolibantang", "Mangaroungou", "Niagha", "Simbandi Balante", "Simbandi Brassou", "Yarang Balante"]
            }
        ]
    },
    {
        name: "Ziguinchor",
        departements: [
            {
                name: "Ziguinchor",
                communes: ["Ziguinchor", "Niaguis", "Adéane", "Boutoupa-Camaracounda", "Enampore", "Nyassia"]
            },
            {
                name: "Bignona",
                communes: ["Bignona", "Thionck-Essyl", "Diouloulou", "Balingore", "Coubalan", "Diego", "Djibidione", "Kamobeul", "Kartiack", "Kataba 1", "Kaye", "Mangagoulack", "Marsassoum", "Mlomp", "Niamone", "Oulampane", "Sindian", "Suelle", "Tenghory"]
            },
            {
                name: "Oussouye",
                communes: ["Oussouye", "Diembéring", "Mlomp", "Oukout", "Santhiaba Manjacque"]
            }
        ]
    }
];

export const getRegions = () => AL_SENEGAL_LOCATIONS.map(r => r.name).sort();

export const getDepartements = (regionName: string) => {
    const region = AL_SENEGAL_LOCATIONS.find(r => r.name === regionName);
    return region ? region.departements.map(d => d.name).sort() : [];
};

export const getCommunes = (regionName: string, departementName: string) => {
    const region = AL_SENEGAL_LOCATIONS.find(r => r.name === regionName);
    if (!region) return [];
    const departement = region.departements.find(d => d.name === departementName);
    return departement ? departement.communes.sort() : [];
};
