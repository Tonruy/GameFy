import { Outlet, Link } from 'react-router-dom';

// Layout for diferent pages
// Header -> common for the pages
// Main/Outlet -> space where React renders the page 

export default function AppLayout() {
	return (
		<div>
			<header style={{ padding: 16, borderBottom: '1px solid #ddd' }}>
				<Link to="/" style={{ marginRight: 12 }}>
					GameFy
				</Link>
				<Link to="/auth">Login</Link>
			</header>

			<main style={{ padding: 16 }}>
				<Outlet />
			</main>
		</div>
	);
}