'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { hexToRgba } from '@/utils/common';

// Social media platform color palette
const PRESET_COLORS = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Turquoise
  '#45B7D1', // Sky Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint Green
  '#F7DC6F', // Yellow
  '#BB8FCE', // Lavender
  '#85C1E2', // Light Blue
  '#F8B739', // Orange
  '#52BE80', // Green
  '#E74C3C', // Red
  '#3498DB', // Blue
  '#9B59B6', // Purple
  '#E67E22', // Dark Orange
  '#1ABC9C', // Teal
  '#F39C12', // Gold
  '#E91E63', // Pink
  '#00BCD4', // Cyan
  '#8E44AD', // Dark Purple
  '#16A085', // Dark Teal
  '#27AE60', // Dark Green
  '#2980B9', // Dark Blue
  '#C0392B', // Dark Red
  '#D35400', // Dark Orange
];

const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

interface IColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

export const ColorPicker = ({ selectedColor, onColorChange, className }: IColorPickerProps) => {
  const { t } = useTranslation('profile');
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [hexInput, setHexInput] = useState(selectedColor);
  const customColorInputRef = useRef<HTMLInputElement>(null);

  const handlePresetClick = (color: string) => {
    onColorChange(color);
    setIsCustomOpen(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onColorChange(value);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Ensure it always starts with #
    if (!value.startsWith('#')) {
      value = `#${value}`;
    }

    // Allow only hex characters after #
    value = `#${value
      .slice(1)
      .replace(/[^0-9a-fA-F]/g, '')
      .slice(0, 8)}`; // max 8 hex chars (RGBA)

    setHexInput(value);

    // Only propagate when it's a valid hex code
    if (HEX_REGEX.test(value)) {
      onColorChange(value);
    }
  };

  useEffect(() => {
    setHexInput(selectedColor);
  }, [selectedColor]);

  useEffect(() => {
    if (isCustomOpen && customColorInputRef.current) {
      customColorInputRef.current.click();
    }
  }, [isCustomOpen]);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid grid-cols-8 gap-2">
        {PRESET_COLORS.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => handlePresetClick(color)}
            className={cn(
              'relative size-8 rounded-full border-2 transition-all duration-200 cursor-pointer',
              'hover:scale-110 hover:ring-2 hover:ring-offset-2',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              selectedColor === color
                ? 'border-foreground ring-2 ring-primary ring-offset-2 scale-110'
                : 'border-border/50 hover:border-foreground/50',
            )}
            style={{ backgroundColor: color }}
            title={color}
            aria-label={`Select color ${color}`}
          >
            {selectedColor === color && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="size-4 text-white drop-shadow-lg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsCustomOpen(!isCustomOpen)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border',
            'transition-colors duration-200 cursor-pointer',
            'hover:bg-muted/50',
            isCustomOpen ? 'border-primary bg-primary/5' : 'border-border/50 bg-background',
          )}
        >
          <div
            className="size-5 rounded border border-border/50"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-xs font-medium text-foreground/70">
            {t('profile:custom_color', 'Custom Color')}
          </span>
        </button>
        <input
          ref={customColorInputRef}
          type="color"
          value={selectedColor}
          onChange={handleCustomColorChange}
          className="size-10 rounded-lg border border-border/50 cursor-pointer overflow-hidden"
          title={t('profile:choose_custom_color', 'Choose custom color')}
        />
      </div>

      {isCustomOpen && (
        <div
          className="p-3 rounded-lg border border-border/50 bg-muted/20"
          style={{
            borderColor: hexToRgba(selectedColor, 0.3),
            backgroundColor: hexToRgba(selectedColor, 0.05),
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="size-6 rounded border border-border/50"
              style={{ backgroundColor: selectedColor }}
            />
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInputChange}
              className="w-28 px-2 py-1 text-xs rounded border border-border/50 bg-background"
              placeholder={t('profile:hex_color_placeholder', '#FFFFFF')}
              maxLength={9} // # + 8 hex chars
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t(
              'profile:hex_color_help_text',
              'Enter color in HEX format (e.g. #FFAA00 or #FFAA00FF)',
            )}
          </p>
        </div>
      )}
    </div>
  );
};
