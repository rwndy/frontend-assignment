import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Employee, Wizard } from "@/pages";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/wizard" replace />} />
				<Route path="/employees" element={<Employee />} />
				<Route path="/wizard" element={<Wizard />} />
			</Routes>
		</BrowserRouter>
	);
}
