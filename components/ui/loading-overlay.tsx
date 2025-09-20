import { cn } from '@/lib/utils';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

interface LoadingOverlayProps {
  visible: boolean;
  className?: string;
}

export function LoadingOverlay({ visible, className }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <View
      className={cn(
        'absolute bottom-0 left-0 right-0 top-0 items-center justify-center bg-[#0006]',
        className
      )}>
      <ActivityIndicator size="large" />
    </View>
  );
}