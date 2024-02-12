import React from "react";

interface Props {
  size?: number
  color?: string
}

const Spinner: React.FC<Props> = React.memo(({ size, color }) => {
  return (
    <div className="border-2 rounded-full animate-spin" style={{ width: size || 32, height: size || 32, borderColor: color || '#ddd', borderTopColor: 'transparent' }} />
  );
})

Spinner.displayName = 'Spinner';
 
export default Spinner;