import { Route, RouteProps, useLocation, useRoute } from "wouter";
import React, { useEffect } from "react";
import ReactGA from "react-ga4";

const TrackedRoute = (props: RouteProps) => {
  const [location, _setLocation] = useLocation();
  const [match] = useRoute(props.path as string);
  useEffect(() => {
    if (match) {
      ReactGA.send({
        hitType: "pageview",
        page: location,
        title: document.title,
      });
    }
  }, [location]);

  return <Route {...props} />;
};

export default TrackedRoute;
// This component is used to track page views with Google Analytics. It uses the `useLocation` hook from `wouter` to get the current location and sends a pageview event to Google Analytics whenever the location changes. The `useEffect` hook is used to run the tracking code whenever the location changes.