import { useEffect } from "react";
import { useLocation } from "wouter";

const ScrollToTop = () => {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]); // Runs whenever the route changes

  return null;
};

export default ScrollToTop;