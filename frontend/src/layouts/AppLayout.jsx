import { Outlet, Link } from 'react-router-dom';
import logoHorizontal from '../assets/logo horizontal.png';

// Layout for diferent pages
// Header -> common for the pages
// Main/Outlet -> space where React renders the page 

export default function AppLayout() {
	return (
		<div>
			<header style={{ padding: 16, borderBottom: '1px solid #ddd' }}>
				<Link to="/" className="header__brand">
					<img className="header__brandLogo" src={logoHorizontal} alt="GameFy" />
				</Link>
				<Link to="/auth">Login</Link>
			</header>

			<main style={{ padding: 16 }}>
				<Outlet />
			</main>
		</div>
	);
}
