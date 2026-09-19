declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean | string;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'ar-placement'?: string;
          'camera-controls'?: boolean | string;
          'touch-action'?: string;
          'auto-rotate'?: boolean | string;
          'auto-rotate-delay'?: number | string;
          'rotation-per-second'?: string;
          'shadow-intensity'?: number | string;
          'shadow-softness'?: number | string;
          exposure?: number | string;
          'environment-image'?: string;
          poster?: string;
          loading?: 'auto' | 'lazy' | 'eager';
          reveal?: 'auto' | 'interaction' | 'manual';
          'camera-orbit'?: string;
          'field-of-view'?: string;
          'min-camera-orbit'?: string;
          'max-camera-orbit'?: string;
          'min-field-of-view'?: string;
          'max-field-of-view'?: string;
          'ios-src'?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
