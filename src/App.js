import './App.css';
import Navbar from "./ui/Navbar";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Calendar} from "./ui/Calendar";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Clients from "./ui/clients/Clients";
import ClientForm from "./ui/clients/ClientForm";
import Reports from "./ui/reports/Reports";

function App() {

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDarkMode);
    }, []);

    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
        },
        // additional theme options here
    });

    const router = createBrowserRouter([
        {
            path: "/",
            element: <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CssBaseline />
                <div >
                    <Navbar></Navbar>
                    <Outlet/>
                </div>
            </LocalizationProvider>,
            children:[
                {
                    path:"/calendar",
                    element:
                        <Calendar></Calendar>
                },
                {
                    path:"/companies",
                    element:
                        <div>
                            <Clients></Clients>
                        </div>
                },
                {
                    path:"/reports",
                    element:
                        <div>
                            <Reports></Reports>
                        </div>
                }
            ]
        },
    ]);

  return (
      <ThemeProvider theme={theme}>
          <RouterProvider router={router}/>
      </ThemeProvider>
  );
}

export default App;
