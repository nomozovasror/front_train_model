import "./App.css";
import { Box, Text } from "@chakra-ui/react";
import { Provider } from "./components/ui/provider";
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from "react-router";
import { Toaster } from "./components/ui/toaster";

//pages
import RootLayout from "./layouts/RootLayout";
import FileUpload from "./pages/FileUpload";
import FilterPage from "./pages/FIlterPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<FileUpload />} />
      <Route path="filter/" element={<FilterPage />} />
    </Route>
  )
);

export default function App() {
  return (
    <Provider>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  );
}
