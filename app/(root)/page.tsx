"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";


const SetUpPage = () => {
  const isOpen = useStoreModal((state) => state.isOpen)
  const onOpen = useStoreModal((state) => state.onOpen)
  
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  },[isOpen,onOpen])
  return (
    <div className="h-screen p-4">
      Root Page
    </div>
  );
};

export default SetUpPage;
