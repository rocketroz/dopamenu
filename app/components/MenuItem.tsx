'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Edit3 } from 'lucide-react';
import { MenuItem as MenuItemType, CategoryType } from '@/lib/types';
import { useDopamenuStore } from '@/lib/store';
import { ENERGY_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MenuItemProps {
  item: MenuItemType;
  categoryId: CategoryType;
  index: number;
}

const energyColors = {
  low: 'bg-teal/20 text-teal',
  medium: 'bg-gold/20 text-gold',
  high: 'bg-coral/20 text-coral',
  any: 'bg-cream/20 text-cream',
};

export function MenuItem({ item, categoryId, index }: MenuItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [showActions, setShowActions] = useState(false);

  const { completeMenuItem, deleteMenuItem, updateMenuItem, lastPickedItem } = useDopamenuStore();

  const isHighlighted = lastPickedItem?.id === item.id;

  const handleComplete = () => {
    completeMenuItem(categoryId, item.id);
  };

  const handleDelete = () => {
    deleteMenuItem(categoryId, item.id);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== item.name) {
      updateMenuItem(categoryId, item.id, { name: editName.trim() });
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: isHighlighted ? 1.02 : 1,
      }}
      exit={{ opacity: 0, x: 10, scale: 0.9 }}
      transition={{
        duration: 0.2,
        delay: index * 0.03,
        layout: { duration: 0.2 }
      }}
      className={cn(
        'group relative flex items-center gap-3 p-3 rounded-xl',
        'bg-night-light/50 border border-cream/5',
        'hover:bg-night-light hover:border-cream/10 transition-colors',
        isHighlighted && 'ring-2 ring-gold/50 bg-gold/5'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Complete button */}
      <motion.button
        onClick={handleComplete}
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          'border border-cream/20 hover:border-cream/40',
          'hover:bg-teal/20 transition-all'
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Check className="w-4 h-4 text-cream/40 group-hover:text-teal" />
      </motion.button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            className="w-full bg-transparent text-cream outline-none border-b border-cream/20 pb-1"
            autoFocus
          />
        ) : (
          <p className="text-cream truncate">{item.name}</p>
        )}

        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            energyColors[item.energy]
          )}>
            {ENERGY_LABELS[item.energy]}
          </span>

          {item.completedCount > 0 && (
            <span className="text-xs text-cream/30">
              {item.completedCount}x
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showActions ? 1 : 0 }}
        className="flex items-center gap-1"
      >
        <motion.button
          onClick={() => setIsEditing(true)}
          className="p-2 rounded-lg hover:bg-cream/10 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Edit3 className="w-3.5 h-3.5 text-cream/40" />
        </motion.button>
        <motion.button
          onClick={handleDelete}
          className="p-2 rounded-lg hover:bg-coral/10 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-3.5 h-3.5 text-cream/40 hover:text-coral" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
