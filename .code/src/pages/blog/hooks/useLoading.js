import { useState, useEffect } from "react";

const useLoading = () => {
  const [isLoading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      stopLoading();
    };
  }, []);

  return { isLoading, startLoading, stopLoading };
};

export default useLoading;
