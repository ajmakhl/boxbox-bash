import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';

export function useEditableField() {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter' || e.key === 'Escape') {
      setIsEditing(false);
    }
  }, []);

  return {
    isEditing,
    inputRef,
    startEditing,
    stopEditing,
    handleKeyDown,
  };
}

export function useEditableIndex() {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingIndex]);

  const startEditing = useCallback((index: number) => {
    setEditingIndex(index);
  }, []);

  const stopEditing = useCallback(() => {
    setEditingIndex(null);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter' || e.key === 'Escape') {
      setEditingIndex(null);
    }
  }, []);

  return {
    editingIndex,
    inputRef,
    startEditing,
    stopEditing,
    handleKeyDown,
  };
}
