import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { theme } from '../../styles/theme';
import { useGuitars } from '../../hooks/useGuitars';
import { Timestamp } from 'firebase/firestore';
import { 
  FaGuitar, 
  FaWrench, 
  FaTools, 
  FaBolt, 
  FaThermometerHalf,
  FaCog
} from 'react-icons/fa';
import { MAINTENANCE_CONSTANTS } from '../../types/maintenance';

interface Props {
  onClose: () => void;
  onSchedule: (data: any) => void;
}

// Maintenance type icons mapping
const maintenanceIcons: Record<string, React.ReactElement> = {
  'String Change': <FaGuitar />,
  'Electronics & Metal Cleaning': <FaBolt />,
  'Tuning & Truss Rod Check': <FaWrench />,
  'Fret & Neck Inspection': <FaTools />,
  'Humidity Check': <FaThermometerHalf />,
  'Professional Setup': <FaCog />
};

export const ScheduleMaintenanceModal = ({ onClose, onSchedule }: Props) => {
  const { guitars, loading } = useGuitars();
  const [selectedType, setSelectedType] = useState('');
  const [selectedGuitar, setSelectedGuitar] = useState('');
  const [customInterval, setCustomInterval] = useState<number | ''>('');
  const [initialDueDate, setInitialDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [autoSchedule, setAutoSchedule] = useState(true);

  // Debug log guitars when they change
  useEffect(() => {
    console.log('ScheduleMaintenanceModal: Guitars available:', guitars.map(g => ({ id: g.id, name: g.name })));
  }, [guitars]);

  // Add escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const selectedMaintenanceType = MAINTENANCE_CONSTANTS.PREDEFINED_TYPES.find(
    type => type.id === selectedType
  );

  // Get tomorrow's date as the minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert the initial due date string to a Timestamp
    const dueDateParts = initialDueDate.split('-').map(Number);
    const dueDate = new Date(dueDateParts[0], dueDateParts[1] - 1, dueDateParts[2]);
    
    onSchedule({
      guitarId: selectedGuitar,
      maintenanceTypeId: selectedType,
      interval: customInterval || selectedMaintenanceType?.interval,
      initialDueDate: Timestamp.fromDate(dueDate),
      notes,
      autoSchedule
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          Loading guitars...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Schedule Maintenance</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guitar Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Guitar
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedGuitar}
              onChange={(e) => setSelectedGuitar(e.target.value)}
              style={{ borderColor: theme.colors.ui.border }}
              required
            >
              <option value="">Choose a guitar...</option>
              {guitars.map(guitar => (
                <option key={guitar.id} value={guitar.id}>
                  {guitar.name || 'Unnamed Guitar'}
                </option>
              ))}
            </select>
          </div>

          {/* Maintenance Types */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Maintenance Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MAINTENANCE_CONSTANTS.PREDEFINED_TYPES.map(type => (
                <div
                  key={type.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                    selectedType === type.id ? 'ring-2' : ''
                  }`}
                  style={{ 
                    borderColor: theme.colors.ui.border,
                    ringColor: theme.colors.primary.steel
                  }}
                  onClick={() => setSelectedType(type.id)}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: `${theme.colors.primary.steel}15`,
                        color: theme.colors.primary.steel
                      }}
                    >
                      {maintenanceIcons[type.name]}
                    </div>
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-sm" style={{ color: theme.colors.text.secondary }}>
                        Every {type.interval} days
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mt-2" style={{ color: theme.colors.text.secondary }}>
                    {type.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {selectedType && (
            <>
              {/* Initial Due Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Initial Due Date
                </label>
                <Input
                  type="date"
                  value={initialDueDate}
                  onChange={(e) => setInitialDueDate(e.target.value)}
                  min={minDate}
                  required
                  className="w-full"
                  style={{ borderColor: theme.colors.ui.border }}
                />
                <p className="text-sm mt-1" style={{ color: theme.colors.text.secondary }}>
                  When should the first maintenance be due?
                </p>
              </div>

              {/* Repeat Interval */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Repeat Interval (Days)
                </label>
                <Input
                  type="number"
                  value={customInterval}
                  onChange={(e) => setCustomInterval(e.target.value ? Number(e.target.value) : '')}
                  placeholder={`Default: ${selectedMaintenanceType?.interval} days`}
                  className="w-full"
                  min="1"
                  style={{ borderColor: theme.colors.ui.border }}
                />
                <p className="text-sm mt-1" style={{ color: theme.colors.text.secondary }}>
                  Leave blank to use the recommended interval
                </p>
              </div>
            </>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Notes (Optional)
            </label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ borderColor: theme.colors.ui.border }}
              placeholder="Add any specific notes or requirements..."
            />
          </div>

          {/* Auto Schedule */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoSchedule}
                onChange={(e) => setAutoSchedule(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">
                Automatically schedule next maintenance after completion
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: theme.colors.ui.backgroundAlt,
                color: theme.colors.text.primary
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: theme.colors.primary.steel,
                color: theme.colors.text.inverse
              }}
            >
              Schedule Maintenance
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 