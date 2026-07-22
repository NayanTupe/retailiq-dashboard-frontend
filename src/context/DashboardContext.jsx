import { createContext, useState, useEffect } from "react";
import { getDashboardDetails } from "../api/dashboard";
import { FALLBACK_DETAILS } from "../api/fallbackData";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await getDashboardDetails();
      setData(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load details, using fallback data", err);
      setData(FALLBACK_DETAILS);
      setError("demo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    getDashboardDetails()
      .then((res) => {
        if (!active) return;
        setData(res.data);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Failed to load details, using fallback data", err);
        setData(FALLBACK_DETAILS);
        setError("demo");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardContext.Provider value={{ data, loading, error, refreshData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export { DashboardContext };
