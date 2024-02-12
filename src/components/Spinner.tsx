import React from "react";

interface Props {
  size?: number
}

const Spinner: React.FC<Props> = React.memo(({ size }) => {
  return (
    <div className="border-2 border-slate-300 border-t-transparent rounded-full animate-spin" style={{ width: size || 32, height: size || 32 }} />
  );
})

Spinner.displayName = 'Spinner';
 
export default Spinner;