// Separating routes from App.jsx -> Best practices and clean.
// IMPORT LAYOUT !!

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout.jsx';

import HomePage from '../pages/HomePage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import GameDetailPage from '../pages/GameDetailPage.jsx';
import CatalogGamesPage from '../pages/CatalogGamesPage.jsx';
import UserFavoritesPage from '../pages/UserFavoritesPage.jsx';
import UserDashboard from '../pages/UserDashboard.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

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
