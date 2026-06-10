// redux
// constants
import {
  PERSIST_BLACKLIST,
  PERSIST_DATA_TIME,
  PERSIST_VERSION,
  PERSIST_WHITELIST, // PERSIST_WHITELIST,
  // STATE_MIGRATIONS,
} from "@/constants";
// utils
import { createPersistStorageUtil } from "@/lib";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  // createMigrate,
  persistReducer,
  persistStore,
} from "redux-persist";

// import { rtkQueryErrorLogger } from "./middleware"
// reducers
import userReducer from "./reducers/user";
import restaurantReducer from "./reducers/restaurant";

// persistent store
const persistConfig = {
  key: "root",
  version: PERSIST_VERSION,
  storage: createPersistStorageUtil(),
  whitelist: PERSIST_WHITELIST,
  // blacklist: PERSIST_BLACKLIST,
  // migrate: createMigrate(STATE_MIGRATIONS, { debug: DEV }),
};

const rootReducer = combineReducers({
  user: userReducer,
  restaurant: restaurantReducer,
});

const makeStore = () => {
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  // eslint-disable-next-line no-console
  // console.error("please remove redux option devTool to set DEV variable!");
  const store = configureStore({
    devTools: true,
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          warnAfter: PERSIST_DATA_TIME,
        },
        immutableCheck: { warnAfter: PERSIST_DATA_TIME },
      }),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

const { store, persistor: persistorStore } = makeStore();
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistorStore;

// export { setAssessmentDetails, setAssessmentStatusAndSteps, setSelectedLang } from "./reducers/assessment"

// store
export default store;
