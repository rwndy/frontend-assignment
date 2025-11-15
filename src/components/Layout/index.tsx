import type { FC, ReactNode } from "react";
import "./layout.css";

interface LayoutProps {
	children: ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
	return (
		<main className="container">
			<div className="card">{children}</div>
		</main>
	);
};

export default Layout;
