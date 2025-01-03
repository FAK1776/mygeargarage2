import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';
import { Guitar, GearType, GearStatus } from '../types/gear';

export const useGuitars = () => {
  const { user } = useAuth();
  const [guitars, setGuitars] = useState<Guitar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuitars = async () => {
      if (!user) {
        setGuitars([]);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching guitars for user:', user.uid);
        const gearRef = collection(db, 'gear');
        const q = query(
          gearRef,
          where('userId', '==', user.uid),
          where('type', '==', GearType.Guitar),
          where('status', '==', GearStatus.Own)
        );

        const querySnapshot = await getDocs(q);
        console.log('Number of guitars found:', querySnapshot.size);

        const guitarData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Raw guitar data:', data);

          // Process guitar data
          console.log('Processing guitar:', {
            id: doc.id,
            name: data.name || 
              (data.make && data.model ? `${data.make} ${data.model}`.trim() : 
                (data.make || data.model || 'Unnamed Guitar')),
            make: data.make,
            model: data.model
          });

          return {
            id: doc.id,
            name: data.name || 
              (data.make && data.model ? `${data.make} ${data.model}`.trim() : 
                (data.make || data.model || 'Unnamed Guitar')),
            make: data.make,
            model: data.model,
            type: data.type,
            status: data.status,
            year: data.year,
            serialNumber: data.serialNumber,
            purchaseDate: data.purchaseDate,
            purchasePrice: data.purchasePrice,
            currentValue: data.currentValue,
            description: data.description,
            specs: data.specs,
            condition: data.condition,
            location: data.location,
            images: data.images || [],
            documents: data.documents || [],
            notes: data.notes,
            userId: data.userId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          } as Guitar;
        });

        console.log('Final processed guitars:', guitarData);
        setGuitars(guitarData);
      } catch (error) {
        console.error('Error fetching guitars:', error);
        setGuitars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuitars();
  }, [user]);

  return { guitars, loading };
}; 