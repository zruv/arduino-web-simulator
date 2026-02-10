import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wokwi-arduino-uno': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'wokwi-led': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { color?: string; pin?: number | string; value?: boolean }, HTMLElement>;
      'wokwi-pushbutton': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { pin?: number | string; pressed?: boolean }, HTMLElement>;
    }
  }
}
