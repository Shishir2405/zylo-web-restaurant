"use client";
import { ToasterWithMax } from "@/components/ui/toastV1";
import store, { persistor } from "@/redux";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const ReduxProvider = ({ children }: any) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {children}
        <ToasterWithMax
          position="top-center"
          max={1}
          toastOptions={{ style: { maxWidth: "calc(44.33vw)" } }}
        />
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
