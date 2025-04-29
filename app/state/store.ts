import { configureStore } from "@reduxjs/toolkit";
import projectsSlice from "@/app/state/projectsSlice";

/**
 * Create and configure the Redux store.
 * For SSR each request will get its own store instance via makeStore().
 */
export const makeStore = () =>
  configureStore({
    reducer: {
      projects: projectsSlice,
    },
  });

/**
 * Type definitions
 */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
