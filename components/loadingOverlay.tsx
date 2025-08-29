"use client";
import { Loader2 } from "lucide-react";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  );
};

export default LoadingOverlay;
