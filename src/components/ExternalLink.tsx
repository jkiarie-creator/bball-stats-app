import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { openBrowserAsync } from 'expo-web-browser';

interface ExternalLinkProps extends TouchableOpacityProps {
  href: string;
}

export function ExternalLink({ href, children, ...props }: ExternalLinkProps) {
  return (
    <TouchableOpacity
      onPress={() => openBrowserAsync(href)}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
} 