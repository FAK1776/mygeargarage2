import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { theme } from '../styles/theme';
import { PageLayout } from '../components/layout/PageLayout';
import { 
  FaGuitar, 
  FaWrench, 
  FaTools, 
  FaBolt, 
  FaThermometerHalf,
  FaCog,
  FaFilter,
  FaPlus,
  FaTrash,
  FaCalendarAlt,
  FaCheck
} from 'react-icons/fa';
import { ScheduleMaintenanceModal } from '../components/maintenance/ScheduleMaintenanceModal';
import { maintenanceService } from '../services/maintenanceService';
import { useAuth } from '../hooks/useAuth';
import { useGuitars } from '../hooks/useGuitars';
import { MaintenanceSchedule, MaintenanceStatus, MAINTENANCE_CONSTANTS } from '../types/maintenance';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Guitar } from '../types/gear';
import { Timestamp } from 'firebase/firestore';

// Maintenance type icons mapping
const maintenanceIcons: Record<string, React.ReactElement> = {
  'String Change': <FaGuitar />,
  'Electronics & Metal Cleaning': <FaBolt />,
  'Tuning & Truss Rod Check': <FaWrench />,
  'Fret & Neck Inspection': <FaTools />,
  'Humidity Check': <FaThermometerHalf />,
  'Professional Setup': <FaCog />
};

interface MaintenanceFormData {
  guitarId: string;
  maintenanceTypeId: string;
  interval: number;
  initialDueDate: Timestamp;
  notes?: string;
  autoSchedule: boolean;
}

export const MaintenanceDashboard = () => {
  const { user } = useAuth();
  const { guitars, loading: guitarsLoading } = useGuitars();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<MaintenanceSchedule | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<MaintenanceStatus | 'all'>('all');
  const [selectedGuitar, setSelectedGuitar] = useState<string>('all');
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  // Debug log guitars when they change
  useEffect(() => {
    console.log('MaintenanceDashboard: Guitars updated:', guitars);
  }, [guitars]);

  // Define fetchSchedules as a component function
  const fetchSchedules = async () => {
    if (!user) return;
    try {
      const userSchedules = await maintenanceService.getUserSchedules(user.uid);
      setSchedules(userSchedules);
    } catch (error) {
      console.error('Error fetching maintenance schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch maintenance schedules on mount and when user changes
  useEffect(() => {
    fetchSchedules();
  }, [user]);

  // Calculate stats
  const stats = {
    overdue: schedules.filter(s => maintenanceService.calculateStatus(s) === 'overdue').length,
    dueSoon: schedules.filter(s => maintenanceService.calculateStatus(s) === 'due-soon').length,
    upToDate: schedules.filter(s => maintenanceService.calculateStatus(s) === 'upcoming').length
  };

  // Filter schedules based on active filter and selected guitar
  const filteredSchedules = schedules.filter(schedule => {
    const status = maintenanceService.calculateStatus(schedule);
    const matchesFilter = activeFilter === 'all' ? true : status === activeFilter;
    const matchesGuitar = selectedGuitar === 'all' ? true : schedule.guitarId === selectedGuitar;
    return matchesFilter && matchesGuitar;
  });

  const handleScheduleMaintenance = async (data: MaintenanceFormData) => {
    if (!user) return;
    
    try {
      console.log('Creating maintenance schedule with data:', data);
      await maintenanceService.createSchedule(user.uid, {
        guitarId: data.guitarId,
        maintenanceTypeId: data.maintenanceTypeId,
        intervalDays: data.interval,
        initialDueDate: data.initialDueDate,
        notes: data.notes,
        autoReschedule: data.autoSchedule,
        nextDueDate: data.initialDueDate
      });
      
      // Refresh schedules
      await fetchSchedules();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating maintenance schedule:', error);
    }
  };

  const handleCompleteTask = async (schedule: MaintenanceSchedule) => {
    try {
      setCompletingTaskId(schedule.id);
      await maintenanceService.completeSchedule(schedule.id, {
        guitarId: schedule.guitarId,
        maintenanceTypeId: schedule.maintenanceTypeId,
        completedDate: Timestamp.now(),
        notes: schedule.notes
      });
      // Refresh schedules
      await fetchSchedules();
    } catch (error) {
      console.error('Error completing maintenance task:', error);
    } finally {
      setCompletingTaskId(null);
    }
  };

  const handleRescheduleTask = async (newDate: Date) => {
    if (!selectedSchedule) return;
    
    try {
      await maintenanceService.rescheduleTask(selectedSchedule.id, newDate);
      await fetchSchedules();
      setShowRescheduleModal(false);
      setSelectedSchedule(null);
    } catch (error) {
      console.error('Error rescheduling task:', error);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedSchedule) return;
    
    try {
      await maintenanceService.deleteSchedule(selectedSchedule.id);
      await fetchSchedules();
      setShowDeleteConfirm(false);
      setSelectedSchedule(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUndoComplete = async (schedule: MaintenanceSchedule) => {
    try {
      await maintenanceService.undoComplete(schedule.id);
      await fetchSchedules();
    } catch (error) {
      console.error('Error undoing completion:', error);
    }
  };

  const StatCard = ({ 
    title, 
    count, 
    color, 
    filterType 
  }: { 
    title: string; 
    count: number; 
    color: string; 
    filterType: typeof activeFilter;
  }) => (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 ${
        activeFilter === filterType ? 'ring-2' : ''
      }`}
      style={{ 
        '--ring-color': color,
        transform: activeFilter === filterType ? 'scale(1.02)' : 'scale(1)'
      } as React.CSSProperties}
      onClick={() => setActiveFilter(activeFilter === filterType ? 'all' : filterType)}
    >
      <h3 className="text-lg font-semibold mb-2" style={{ color }}>
        {title}
        {activeFilter === filterType && (
          <span className="ml-2 text-sm">(Filtered)</span>
        )}
      </h3>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );

  if (loading || guitarsLoading) {
    return (
      <PageLayout title="Maintenance">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Maintenance">
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaFilter style={{ color: theme.colors.text.secondary }} />
            <select
              className="border rounded-md p-2"
              value={selectedGuitar}
              onChange={(e) => setSelectedGuitar(e.target.value)}
              style={{ borderColor: theme.colors.ui.border }}
            >
              <option value="all">All Guitars</option>
              {guitars.map((guitar: Guitar) => (
                <option key={guitar.id} value={guitar.id}>
                  {guitar.name}
                </option>
              ))}
            </select>
            {(activeFilter !== 'all' || selectedGuitar !== 'all') && (
              <button 
                className="text-sm underline"
                onClick={() => {
                  setActiveFilter('all');
                  setSelectedGuitar('all');
                }}
                style={{ color: theme.colors.primary.steel }}
              >
                Clear filters
              </button>
            )}
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg"
            style={{
              backgroundColor: theme.colors.primary.steel,
              color: theme.colors.text.inverse
            }}
          >
            <FaPlus size={14} />
            <span>Schedule Maintenance</span>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Overdue" 
            count={stats.overdue} 
            color={theme.colors.state.error}
            filterType="overdue"
          />
          <StatCard 
            title="Due Soon" 
            count={stats.dueSoon} 
            color={theme.colors.state.warning}
            filterType="due-soon"
          />
          <StatCard 
            title="Up to Date" 
            count={stats.upToDate} 
            color={theme.colors.state.success}
            filterType="upcoming"
          />
        </div>

        {/* Maintenance Tasks */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {activeFilter === 'all' 
                ? selectedGuitar === 'all'
                  ? 'All Maintenance Tasks'
                  : `Maintenance Tasks for ${guitars.find((g: Guitar) => g.id === selectedGuitar)?.name}`
                : `${activeFilter.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())} Tasks`}
            </h2>
            <div className="space-y-4">
              {filteredSchedules.map(schedule => {
                const status = maintenanceService.calculateStatus(schedule);
                const maintenanceType = MAINTENANCE_CONSTANTS.PREDEFINED_TYPES.find(
                  t => t.id === schedule.maintenanceTypeId
                );
                const guitar = guitars.find((g: Guitar) => g.id === schedule.guitarId);

                return (
                  <div
                    key={schedule.id}
                    className={`border rounded-lg p-4 flex items-center justify-between transition-all duration-300 ${
                      schedule.isCompleted ? 'bg-green-50' : ''
                    }`}
                    style={{
                      borderColor: schedule.isCompleted
                        ? theme.colors.state.success
                        : status === 'overdue' 
                        ? theme.colors.state.error 
                        : status === 'due-soon'
                        ? theme.colors.state.warning
                        : theme.colors.ui.border
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div 
                        className="mt-1 p-2 rounded-lg"
                        style={{ 
                          backgroundColor: schedule.isCompleted
                            ? `${theme.colors.state.success}15`
                            : status === 'overdue'
                            ? `${theme.colors.state.error}15`
                            : status === 'due-soon'
                            ? `${theme.colors.state.warning}15`
                            : `${theme.colors.primary.steel}15`,
                          color: schedule.isCompleted
                            ? theme.colors.state.success
                            : status === 'overdue'
                            ? theme.colors.state.error
                            : status === 'due-soon'
                            ? theme.colors.state.warning
                            : theme.colors.primary.steel
                        }}
                      >
                        {schedule.isCompleted ? <FaCheck /> : (maintenanceType && maintenanceIcons[maintenanceType.name] || <FaWrench />)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{guitar?.name}</h3>
                        <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                          {maintenanceType?.name}
                        </p>
                        {schedule.isCompleted ? (
                          <div className="mt-1 space-y-1">
                            <p className="text-sm flex items-center" style={{ color: theme.colors.state.success }}>
                              <FaCheck className="mr-1" size={12} />
                              Completed on {schedule.lastCompletedDate?.toDate().toLocaleDateString()}
                            </p>
                            <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                              Next due: {schedule.nextDueDate.toDate().toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm mt-1" style={{ color: theme.colors.text.secondary }}>
                            Due: {schedule.nextDueDate.toDate().toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {schedule.isCompleted ? (
                        <Button
                          onClick={() => handleUndoComplete(schedule)}
                          className="px-3 py-1 rounded flex items-center space-x-1 hover:bg-gray-100"
                          style={{
                            backgroundColor: 'transparent',
                            color: theme.colors.text.secondary,
                            border: `1px solid ${theme.colors.ui.border}`
                          }}
                        >
                          <span>Undo</span>
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={() => handleCompleteTask(schedule)}
                            className="px-3 py-1 rounded flex items-center space-x-1"
                            style={{
                              backgroundColor: theme.colors.state.success,
                              color: theme.colors.text.inverse
                            }}
                            disabled={completingTaskId === schedule.id}
                          >
                            {completingTaskId === schedule.id ? (
                              <LoadingSpinner size="sm" className="mr-1" />
                            ) : (
                              <FaCheck size={14} className="mr-1" />
                            )}
                            <span>{completingTaskId === schedule.id ? 'Completing...' : 'Complete'}</span>
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              setShowRescheduleModal(true);
                            }}
                            className="px-3 py-1 rounded flex items-center space-x-1"
                            style={{
                              backgroundColor: theme.colors.ui.backgroundAlt,
                              color: theme.colors.text.primary
                            }}
                          >
                            <FaCalendarAlt size={14} />
                            <span>Reschedule</span>
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setShowDeleteConfirm(true);
                        }}
                        className="px-3 py-1 rounded flex items-center space-x-1"
                        style={{
                          backgroundColor: theme.colors.ui.backgroundAlt,
                          color: theme.colors.state.error
                        }}
                      >
                        <FaTrash size={14} />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
              {filteredSchedules.length === 0 && (
                <div className="text-center py-8" style={{ color: theme.colors.text.secondary }}>
                  No maintenance tasks found
                  {selectedGuitar !== 'all' && ' for this guitar'}
                  {activeFilter !== 'all' && ` that are ${activeFilter.replace('-', ' ')}`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Maintenance Modal */}
      {showAddModal && (
        <ScheduleMaintenanceModal
          onClose={() => setShowAddModal(false)}
          onSchedule={handleScheduleMaintenance}
        />
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Reschedule Maintenance</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Due Date</label>
                <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  min={new Date().toISOString().split('T')[0]}
                  defaultValue={selectedSchedule.nextDueDate.toDate().toISOString().split('T')[0]}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [year, month, day] = e.target.value.split('-').map(Number);
                      const newDate = new Date(year, month - 1, day);
                      handleRescheduleTask(newDate);
                    }
                  }}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setSelectedSchedule(null);
                  }}
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: theme.colors.ui.backgroundAlt,
                    color: theme.colors.text.primary
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Delete Maintenance Schedule</h2>
            <p className="mb-4">Are you sure you want to delete this maintenance schedule? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedSchedule(null);
                }}
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: theme.colors.ui.backgroundAlt,
                  color: theme.colors.text.primary
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteTask}
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: theme.colors.state.error,
                  color: theme.colors.text.inverse
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}; 