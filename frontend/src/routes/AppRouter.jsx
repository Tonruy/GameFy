// Separating routes from App.jsx -> Best practices and clean.
// IMPORT LAYOUT !!

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage';
import GameDetailPage from '../pages/GameDetailPage';
import CatalogGamesPage from '../pages/CatalogGamesPage';
import UserFavoritesPage from '../pages/UserFavoritesPage';
import UserDashboard from '../pages/UserDashboard';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/games/:gameId" element={<GameDetailPage />} />
					<Route path="/:mode/:id" element={<CatalogGamesPage />} />
					<Route path="/dashboard" element={<UserDashboard />} />
					<Route path="/favorites" element={<UserFavoritesPage />} />
				</Route>
				<Route path="/auth" element={<RegisterPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
}
