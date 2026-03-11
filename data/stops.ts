export interface Stop {
    /* Name of the stop. Undefined if no official name is available - check customName field instead. */
    name?: string;
    /* Custom name of the stop, sometimes used for better clarity or if no official name is available. */
    customName?: string;
    /* If the stop is a transition "hub" for two lines (e.g. red line ending and continuing as yellow line) */
    isHub?: boolean;
    /* Location coordinates (latitude and longitude) of the stop */
    location: {
        lat: number;
        lng: number;
    };
}

const stops: { [key: number]: Stop } = {
    1: {
        name: "Plaça Escoles",
        isHub: true,
        location: {
            lat: 42.12232020441073,
            lng: 3.131823559503832
        }
    },
    2: {
        name: "Riells Univers",
        location: {
            lat: 42.11615061608746,
            lng: 3.1364057749248224
        }
    },
    3: {
        name: "Avinguda de Montgó",
        location: {
            lat: 42.11348225865508,
            lng: 3.1416175450558503
        }
    },
    4: {
        name: "Camping Maite",
        location: {
            lat: 42.11379479758387,
            lng: 3.1444271457387547
        }
    },
    5: {
        name: "Unknown location and name",
        location: {
            lat: 0,
            lng: 0
        }
    },
    6: {
        customName: "La Clota",
        location: {
            lat: 42.115381732105526,
            lng: 3.1456051425615352
        }
    },
    7: {
        customName: "Port de L'Escala",
        location: {
            lat: 42.11569384081565,
            lng: 3.149180825782885
        }
    },
    8: {
        name: "Unknown name",
        location: {
            lat: 42.116311,
            lng: 3.152395
        }
    },
    9: {
        name: "Unknown name",
        location: {
            lat: 42.112216,
            lng: 3.156713
        }
    },
    10: {
        name: "Camp. Cala Montgó",
        location: {
            lat: 42.110493,
            lng: 3.163896
        }
    },
    11: {
        name: "Camp. Illa Mateua",
        location: {
            lat: 42.11027,
            lng: 3.165774
        }
    },
    12: {
        name: "Cala Montgó",
        isHub: true,
        location: {
            lat: 42.109291,
            lng: 3.167785
        }
    },
    13: {
        name: "Camp. Illa Mateua",
        location: {
            lat: 42.11027,
            lng: 3.165774
        }
    },
    14: {
        name: "Camp. Cala Montgó",
        location: {
            lat: 42.110493,
            lng: 3.163896
        }
    },
    15: {
        name: "Unknown name",
        location: {
            lat: 42.112216,
            lng: 3.156713
        }
    },
    16: {
        customName: "Port de L'Escala",
        location: {
            lat: 42.11577133477449,
            lng: 3.148929133535077
        }
    },
    17: {
        customName: "La Clota",
        location: {
            lat: 42.11551006449247,
            lng: 3.1458418475006376
        }
    },
    18: {
        name: "Camping Maite",
        location: {
            lat: 42.11379479758387,
            lng: 3.1444271457387547
        }
    },
    19: {
        name: "Avinguda de Montgó",
        location: {
            lat: 42.1135723313567,
            lng: 3.1414570282882983
        }
    },
    20: {
        name: "Platja Riells",
        location: {
            lat: 42.11610046008326,
            lng: 3.136560352837334
        }
    },
    21: {
        customName: "Escultura la Cobla",
        location: {
            lat: 42.123993011946936,
            lng: 3.1364788327064193
        }
    },
    22: {
        name: "Pl. del Peix Platja",
        location: {
            lat: 42.12600339400167,
            lng: 3.133028708769837
        }
    },
    23: {
        customName: "Avinguda de Girona",
        location: {
            lat: 42.12043263885362,
            lng: 3.1312618852226746
        }
    },
    24: {
        customName: "Platja Cala de la Creu",
        location: {
            lat: 42.1268130398566,
            lng: 3.1286840308757036
        }
    },
    // TODO: APPROX. LOCATION - Check correct coordinates
    25: {
        customName: "Platja del Rec",
        location: {
            lat: 42.12878404633531,
            lng: 3.123060802071102
        }
    },
    // TODO: APPROX. LOCATION - Check correct coordinates
    26: {
        name: "H. Spa Empúries",
        location: {
            lat: 42.13185498500814,
            lng: 3.121949246034542
        }
    },
    // TODO: APPROX. LOCATION - Check correct coordinates
    27: {
        customName: "Ruïnes d'Empúries",
        location: {
            lat: 42.135228375237986,
            lng: 3.121346953034977
        }
    },
    28: {
        name: "St. Marti d’Empúries",
        isHub: true,
        location: {
            lat: 42.13915531929414,
            lng: 3.118488339593285
        }
    },
    // TODO: APPROX. LOCATION - Check correct coordinates (Same loc. as stop 27)
    29: {
        customName: "Ruïnes d'Empúries",
        location: {
            lat: 42.135228375237986,
            lng: 3.121346953034977
        }
    },
    // TODO: APPROX. LOCATION - Check correct coordinates (Same loc. as stop 26)
    30: {
        customName: "H. Spa Empúries",
        location: {
            lat: 42.13185498500814,
            lng: 3.121949246034542
        }
    },
    // TODO: APPROX. LOCATION - Check correct coordinates (Same loc. as stop 25)
    31: {
        customName: "Platja del Rec",
        location: {
            lat: 42.12878404633531,
            lng: 3.123060802071102
        }
    },
    32: {
        customName: "Av. Francesc Macià",
        location: {
            lat: 42.125562269103604,
            lng: 3.1247775941592524
        }
    },
    // TODO: APPROX. LOCATION - Check correct coordinates
    33: {
        customName: "Platja Cala de la Creu",
        location: {
            lat: 42.12684910821327,
            lng: 3.128412841339957
        }
    },
    34: {
        name: "Pl. del Peix Platja",
        location: {
            lat: 42.12600339400167,
            lng: 3.133028708769837
        }
    }
};

export default stops;
