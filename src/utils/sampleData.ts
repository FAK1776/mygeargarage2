import { GearService } from '../services/gearService';
import { GearFormData, GearStatus, GearType } from '../types/gear';

const sampleGuitars: GearFormData[] = [
  {
    make: "Martin",
    model: "D-28",
    year: "2020",
    modelNumber: "C20-063285",
    series: "Custom Shop",
    serialNumber: "",
    orientation: "Right Handed",
    numberOfStrings: "6",
    weight: "",
    description: "Custom 'M/0000' Grand Auditorium Body",
    images: [],
    status: GearStatus.Own,
    type: GearType.Guitar,
    specs: {
      body: {
        shape: "Grand Auditorium",
        type: "Acoustic",
        material: "East Indian Rosewood (Back and Sides), Adirondack Spruce (Top)",
        topBack: "Spruce Top",
        finish: "Gloss",
        depth: "Standard",
        binding: "Antique White",
        bracing: "X-Brace, Scalloped",
        cutaway: "None",
        topColor: "Clear"
      },
      neck: {
        material: "Select Hardwood",
        shape: "Modified Low Oval",
        thickness: "",
        construction: "Dovetail Joint",
        finish: "Satin",
        scaleLength: '25.4"',
        fingerboardMaterial: "Black Ebony",
        fingerboardRadius: '16"',
        numberOfFrets: "20",
        fretSize: "Standard",
        nutMaterial: "Bone",
        nutWidth: '1 3/4"',
        fingerboardInlays: "Diamonds and Squares Long",
        binding: "None",
        sideDots: "White"
      },
      headstock: {
        shape: "Slotted with Square Slots",
        binding: "None",
        tuningMachines: "Schaller Nickel GrandTune",
        headplateLogo: ""
      },
      hardware: {
        bridge: "Modern Belly",
        tailpiece: "",
        finish: "",
        pickguard: "Faux Tortoise",
        knobs: "",
        strapButtons: ""
      },
      electronics: {
        pickupSystem: "None",
        neckPickup: "",
        bridgePickup: "",
        pickupConfiguration: "",
        controls: "",
        pickupSwitching: "",
        auxiliarySwitching: ""
      },
      extras: {
        strings: "Authentic Acoustic Lifespan 2.0, Light Gauge",
        caseOrGigBag: "5-Ply Hardshell Case",
        modificationsRepairs: "",
        uniqueFeatures: ""
      }
    }
  },
  {
    make: "Gretsch",
    model: "G9220 Bobtail™",
    year: "2019",
    modelNumber: "2716013503",
    series: "Roots Collection",
    serialNumber: "",
    orientation: "Right Handed",
    numberOfStrings: "6",
    weight: "",
    description: "G9220 Bobtail™ Round-Neck Resonator Guitar",
    images: [],
    status: GearStatus.Own,
    type: GearType.Guitar,
    specs: {
      body: {
        shape: "Resonator",
        type: "Acoustic",
        material: "Laminated Mahogany",
        topBack: "",
        finish: "Vintage Semi-Gloss",
        depth: "Standard",
        binding: "",
        bracing: "Internal Sound-Well",
        cutaway: "None",
        topColor: "2-Color Sunburst"
      },
      neck: {
        material: "Mahogany",
        shape: "Medium 'V'",
        thickness: "",
        construction: "Set-Neck",
        finish: "Vintage Semi-Gloss",
        scaleLength: '25"',
        fingerboardMaterial: "Padauk",
        fingerboardRadius: '15.75"',
        numberOfFrets: "19",
        fretSize: "Medium Jumbo",
        nutMaterial: "Bone",
        nutWidth: '1.75"',
        fingerboardInlays: "White Dot",
        binding: "",
        sideDots: ""
      },
      headstock: {
        shape: "1930s Gretsch® 3x3",
        binding: "",
        tuningMachines: "Grover® Sta-Tite™ Die-Cast",
        headplateLogo: ""
      },
      hardware: {
        bridge: "Spider - Fishman® Nashville",
        tailpiece: "Weathered Trapeze Tailpiece",
        finish: "Chrome",
        pickguard: "",
        knobs: "",
        strapButtons: ""
      },
      electronics: {
        pickupSystem: "Fishman® Nashville Resophonic Pickup",
        neckPickup: "",
        bridgePickup: "",
        pickupConfiguration: "",
        controls: "",
        pickupSwitching: "",
        auxiliarySwitching: ""
      },
      extras: {
        strings: "D'Addario® EJ16 Phosphor Bronze, Light (.012-.053)",
        caseOrGigBag: "Optional G6296 Gretsch® Round Neck Resonator Hardshell",
        modificationsRepairs: "",
        uniqueFeatures: ""
      }
    }
  },
  {
    make: "Fender",
    model: "Classic Player Baja Telecaster",
    year: "2018",
    modelNumber: "",
    series: "Classic Player",
    serialNumber: "",
    orientation: "Right Handed",
    numberOfStrings: "6",
    weight: "",
    description: "Classic Player Baja Telecaster",
    images: [],
    status: GearStatus.Own,
    type: GearType.Guitar,
    specs: {
      body: {
        shape: "Telecaster",
        type: "Solidbody",
        material: "Ash",
        topBack: "",
        finish: "Polyester",
        depth: "",
        binding: "",
        bracing: "",
        cutaway: "None",
        topColor: "2-Color Sunburst"
      },
      neck: {
        material: "Maple (1-Piece, Bolt-On)",
        shape: "Soft 'V'",
        thickness: "",
        construction: "Bolt-On",
        finish: "Gloss Polyurethane",
        scaleLength: '25.5"',
        fingerboardMaterial: "Maple",
        fingerboardRadius: '9.5"',
        numberOfFrets: "21",
        fretSize: "Medium Jumbo",
        nutMaterial: "Synthetic Bone",
        nutWidth: '1.625"',
        fingerboardInlays: "Black Dots",
        binding: "",
        sideDots: ""
      },
      headstock: {
        shape: "Standard Telecaster",
        binding: "",
        tuningMachines: "Fender/Ping Vintage Style",
        headplateLogo: ""
      },
      hardware: {
        bridge: "Vintage Style 3-Saddle Strings-Thru-Body Tele Bridge",
        tailpiece: "",
        finish: "Chrome",
        pickguard: "None",
        knobs: "Knurled Chrome",
        strapButtons: ""
      },
      electronics: {
        pickupSystem: "",
        neckPickup: "Custom Shop Twisted Tele Single-Coil",
        bridgePickup: "Custom Shop Broadcaster Single-Coil",
        pickupConfiguration: "Single-Coil / Single-Coil",
        controls: "Master Volume, Master Tone",
        pickupSwitching: "4-Way Blade Switch + 2-Way S-1 Switch",
        auxiliarySwitching: "S-1 Phase Selector"
      },
      extras: {
        strings: "Fender Super 250R (.010-.046)",
        caseOrGigBag: "Gig Bag",
        modificationsRepairs: "",
        uniqueFeatures: ""
      }
    }
  }
];

export const loadSampleData = async (userId: string) => {
  const gearService = new GearService();
  
  for (const guitar of sampleGuitars) {
    try {
      await gearService.addGear(userId, guitar);
      console.log(`Added ${guitar.make} ${guitar.model}`);
    } catch (error) {
      console.error(`Error adding ${guitar.make} ${guitar.model}:`, error);
    }
  }
}; 