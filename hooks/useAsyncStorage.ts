import { useState, useEffect } from 'react';
import { asyncStore } from '@/stores/asyncStore';

export function useAsyncStorage() {
  const [data, setData] = useState<StorageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const storageData = await asyncStore.getData();
    setData(storageData);
    setLoading(false);
  };

  const updateData = async (newData: Partial<StorageData>) => {
    await asyncStore.setData(newData);
    await loadData();
  };

  return { data, loading, updateData };
} 