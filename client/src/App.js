import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainAppBar from './components/MainAppBar'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import "./app.css"
import HomePage from './pages/HomePage';


function App() {
    return (
        <BrowserRouter>
            <MainAppBar />
            <Routes >
                <Route path="/profile" element={<Profile />} />
                <Route path="/track" element={<HomePage />} />
                <Route path="/view" element={<Dashboard />} />
                <Route path="/" element={<HomePage />} />
            </Routes >
        </BrowserRouter>
    );
}

export default App;
