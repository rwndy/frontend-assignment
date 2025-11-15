import type { FC } from "react";
import { PLACEHOLDERS } from "@/libs/constants";
import type { MergedEmployee } from "@/libs/types";
import { getImageSrc } from "@/utils";

import "./Employee.css";

interface EmployeeTableProps {
	employees: MergedEmployee[];
}

const EmployeeTable: FC<EmployeeTableProps> = ({ employees }) => {
	return (
		<div className="tableWrapper">
			<table className="table">
				<thead>
					<tr>
						<th>Photo</th>
						<th>Name</th>
						<th>Department</th>
						<th>Role</th>
						<th>Location</th>
					</tr>
				</thead>
				<tbody>
					{employees.length === 0 ? (
						<tr>
							<td colSpan={5} className="emptyState">
								No employees found
							</td>
						</tr>
					) : (
						employees.map((employee) => {
							return (
								<tr key={employee.id}>
									<td>
										<div className="photoCell">
											{employee.photo ? (
												<img
													src={getImageSrc(employee.photo)}
													alt={employee.fullName || "Employee"}
													className={"photo"}
													onError={(e) => {
														e.currentTarget.style.display = "none";
														if (e.currentTarget.nextElementSibling) {
															(
																e.currentTarget
																	.nextElementSibling as HTMLElement
															).style.display = "flex";
														}
													}}
												/>
											) : null}
											<div
												className={"photoPlaceholder"}
												style={{ display: employee.photo ? "none" : "flex" }}
											>
												{employee.fullName
													? employee.fullName.charAt(0).toUpperCase()
													: "?"}
											</div>
										</div>
									</td>
									<td>
										<div className="nameCell">
											<div className="fullName">
												{employee.fullName || PLACEHOLDERS.MISSING_FIELD}
											</div>
											<div className="email">{employee.email}</div>
										</div>
									</td>
									<td>{employee.department || PLACEHOLDERS.MISSING_FIELD}</td>
									<td>{employee.role || PLACEHOLDERS.MISSING_FIELD}</td>
									<td>{employee.location || PLACEHOLDERS.NOT_AVAILABLE}</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
};

export default EmployeeTable;
