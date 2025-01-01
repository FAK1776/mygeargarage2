import React, { useState } from 'react';
import { BaseGear } from '../../types/gear';
import { GeminiService } from '../../services/geminiService';

interface GearSpecParserProps {
  onSpecsParsed: (parsedGear: Partial<BaseGear>) => void;
}

export const GearSpecParser: React.FC<GearSpecParserProps> = ({ onSpecsParsed }) => {
  const [specs, setSpecs] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<Partial<BaseGear> | null>(null);
  const geminiService = new GeminiService();

  const handleParse = async () => {
    if (!specs.trim()) return;

    setLoading(true);
    setError(null);
    setParsedData(null);

    try {
      console.log('Attempting to parse specs:', specs);
      const result = await geminiService.parseGearSpecs(specs);
      console.log('Raw parsed result:', result);

      // Map the parsed data to our GuitarSpecs structure
      const mappedData: Partial<BaseGear> = {
        type: result.type,
        make: result.make,
        model: result.model,
        year: result.year || '',
        modelNumber: result.modelNumber,
        serialNumber: result.serialNumber,
        specs: {
          overview: {
            manufacturer: result.make || '',
            model: result.model || '',
            bodySizeShape: result.specs?.body?.size || '',
            series: result.series || '',
            buildType: result.specs?.body?.type || '',
            topMaterial: result.specs?.body?.material || '',
            bodyMaterial: result.specs?.body?.material || '',
            scaleLength: result.specs?.neck?.scaleLength || '',
            nutWidth: result.specs?.neck?.nut?.width || '',
            neckShapeProfile: result.specs?.neck?.shape || '',
            neckTypeConstruction: result.specs?.neck?.construction || '',
            pickupConfiguration: result.specs?.electronics?.pickupConfiguration || '',
            countryOfOrigin: result.specs?.body?.countryOfOrigin || '',
            serialNumber: result.serialNumber || '',
          },
          top: {
            color: result.specs?.body?.topColor || '',
            finish: result.specs?.body?.finish || '',
            binding: result.specs?.body?.binding || '',
            inlayMaterial: '',
            detail: '',
            bridgeStyle: result.specs?.hardware?.bridge || '',
            rosette: result.specs?.body?.rosette?.type || '',
            bridgeStringSpacing: '',
            bridgeMaterial: '',
            bridgePinMaterial: '',
            bridgePinDots: '',
            saddle: '',
            saddleRadius: '',
          },
          body: {
            design: {
              color: result.specs?.body?.material || '',
              finish: result.specs?.body?.finish || '',
              binding: result.specs?.body?.binding || '',
              backPurfling: '',
              backInlayMaterial: '',
              backDetail: '',
              sideDetail: '',
              sideInlayMaterial: '',
              endpiece: '',
              endpieceInlay: '',
              heelcap: '',
            },
            bracing: {
              bodyBracing: result.specs?.body?.bracing?.pattern || '',
              bracingPattern: result.specs?.body?.bracing?.pattern || '',
              braceShape: result.specs?.body?.bracing?.shape || '',
              braceMaterial: '',
              braceSize: '',
            },
            dimensions: {
              bodyDepth: result.specs?.body?.depth || '',
              upperBoutWidth: '',
              upperBoutDepth: '',
              lowerBoutWidth: '',
              lowerBoutDepth: '',
            },
          },
          neckAndHeadstock: {
            neck: {
              taper: '',
              material: result.specs?.neck?.material || '',
              color: '',
              finish: result.specs?.neck?.finish || '',
              binding: result.specs?.neck?.binding || '',
              numberOfFrets: result.specs?.neck?.numberOfFrets || '',
              joinsBodyAt: '',
              sideDots: result.specs?.neck?.fingerboard?.sideDots || '',
              trussRodType: '',
              nutMaterial: result.specs?.neck?.nut?.material || '',
            },
            fingerboard: {
              material: result.specs?.neck?.fingerboard?.material || '',
              radius: result.specs?.neck?.fingerboard?.radius || '',
              widthAt12thFret: '',
              inlayStyle: result.specs?.neck?.fingerboard?.inlays || '',
              inlayMaterial: '',
              bindingMaterial: result.specs?.neck?.fingerboard?.binding || '',
              rolledEdges: '',
              fretSize: result.specs?.neck?.fretSize || '',
              fretMarkerStyle: result.specs?.neck?.fingerboard?.inlays || '',
            },
            headstock: {
              shape: '',
              plateMaterial: '',
              logoStyle: '',
              bindingMaterial: result.specs?.headstock?.binding || '',
              detail: '',
            },
          },
          electronics: {
            acousticPickup: '',
            numberOfPickups: '',
            bridgePickup: result.specs?.electronics?.bridgePickup || '',
            middlePickup: result.specs?.electronics?.middlePickup || '',
            neckPickup: result.specs?.electronics?.neckPickup || '',
            pickupColor: '',
            controls: result.specs?.electronics?.controls || '',
            pickupSwitching: result.specs?.electronics?.pickupSwitching || '',
            outputType: '',
            specialElectronics: '',
          },
          hardware: {
            bridge: result.specs?.hardware?.bridge || '',
            finish: result.specs?.hardware?.finish || '',
            tuningMachines: result.specs?.hardware?.tuningMachines || '',
            tuningMachineKnobs: '',
            tailpiece: result.specs?.hardware?.tailpiece || '',
            pickguard: result.specs?.hardware?.pickguard?.type || '',
            pickguardInlay: result.specs?.hardware?.pickguard?.inlay || '',
            controlKnobs: result.specs?.hardware?.knobs || '',
            switchTip: '',
            neckPlate: '',
            strapButtons: result.specs?.hardware?.strapButtons || '',
          },
          miscellaneous: {
            pleked: result.pleked || false,
            label: result.label || '',
            case: result.specs?.extras?.caseOrGigBag || '',
            recommendedStrings: result.specs?.extras?.recommendedStrings || '',
            weight: '',
            orientation: result.orientation || '',
            comments: '',
          },
        },
      };

      console.log('Final parsed result:', mappedData);
      setParsedData(mappedData);
      onSpecsParsed(mappedData);
    } catch (err) {
      console.error('Error parsing specs:', err);
      setError('Failed to parse specifications. Please check the format and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={specs}
        onChange={(e) => {
          setSpecs(e.target.value);
          setParsedData(null);
          setError(null);
        }}
        placeholder="Paste the manufacturer's specifications here..."
        className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430] focus:border-transparent resize-y"
        disabled={loading}
      />

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {parsedData && (
        <div className="text-sm bg-green-50 p-3 rounded-md border border-green-200">
          <p className="font-medium text-green-800 mb-2">✓ Successfully parsed specifications</p>
          <div className="text-green-700 grid grid-cols-2 gap-2">
            <div>Make: {parsedData.make}</div>
            <div>Model: {parsedData.model}</div>
            {parsedData.year && <div>Year: {parsedData.year}</div>}
            {parsedData.modelNumber && <div>Model Number: {parsedData.modelNumber}</div>}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleParse}
          disabled={loading || !specs.trim()}
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
            loading || !specs.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#EE5430] hover:bg-[#EE5430]/90'
          }`}
        >
          {loading ? 'Processing...' : 'Parse Specifications'}
        </button>
      </div>
    </div>
  );
}; 