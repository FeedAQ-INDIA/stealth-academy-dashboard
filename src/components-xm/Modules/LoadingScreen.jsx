// This file is deprecated. Use Spinner component directly instead.
// 
// Example usage:
// <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
//   <Spinner size="lg" />
//   <p className="text-sm text-muted-foreground">Loading...</p>
// </div>

import { Spinner } from "@/components/ui/spinner";

/**
 * @deprecated Use Spinner component directly for consistency
 */
export function LoadingScreen({ message = "Loading...", size = "lg" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Spinner size={size} />
      <p className="text-sm text-muted-foreground font-medium">{message}</p>
    </div>
  );
}

export default LoadingScreen;