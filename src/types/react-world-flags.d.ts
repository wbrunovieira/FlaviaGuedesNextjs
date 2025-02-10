declare module 'react-world-flags' {
  import * as React from 'react';

  type FlagProps = {
    code: string;
    className?: string;
    style?: React.CSSProperties;
    fallback?: React.ReactNode;
  };

  const Flag: React.FC<FlagProps>;

  export default Flag;
}
