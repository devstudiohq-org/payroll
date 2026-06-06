import { employees } from '../data/employees';

export default function EmployeeTable() {
  return (
    <div className="bg-white rounded-xl shadow mt-6">
      <table className="w-full">
        <thead className="border-b">
          <tr className="text-gray-500">
            <th className="p-4 text-left">Name</th>

            <th>TRN</th>
            <th>NIS</th>
            <th>Salary</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {employee.initials}
                  </div>

                  <div>
                    <h3>{employee.name}</h3>

                    <p className="text-sm text-gray-500">{employee.role}</p>
                  </div>
                </div>
              </td>

              <td>{employee.trn}</td>

              <td>{employee.nis}</td>

              <td>${employee.salary.toLocaleString()}</td>

              <td>
                <span className="bg-green-100 px-3 py-1 rounded-full text-green-700">
                  {employee.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
