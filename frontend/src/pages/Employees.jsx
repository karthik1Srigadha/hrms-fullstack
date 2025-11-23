import { useEffect, useState } from "react";
import api from "../services/api";
import "../pages/Styles/Auth.css";


export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const isEditing = !!form.id;

  async function loadEmployees() {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to load employees:", err);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (isEditing) {
        await api.put(`/employees/${form.id}`, form);
      } else {
        await api.post("/employees", form);
      }

      setForm({
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });

      loadEmployees();
    } catch (err) {
      console.error("Employee save error:", err);
    }
  }

  function startEdit(emp) {
    setForm({
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete employee?")) return;

    try {
      await api.delete(`/employees/${id}`);
      loadEmployees();
    } catch (err) {
      console.error("Delete employee error:", err);
    }
  }

  return (
    <div className="page">
      <h2>Employees</h2>

      <section className="form-section">
        <h3>{isEditing ? "Edit Employee" : "Add Employee"}</h3>

        <form className="entity-form" onSubmit={handleSubmit}>
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <button type="submit">{isEditing ? "Update" : "Create"}</button>
        </form>
      </section>

      <section>
        <h3>Employee List</h3>

        <table className="list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Teams</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td data-label="Name">
                  {emp.firstName} {emp.lastName}</td>
                <td data-label="Email">{emp.email}</td>
                <td data-label="Teams">{emp.teams?.length? emp.teams.map(t => (<span key={t.id} className="team-badge">{t.name}</span>)): "—"}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn edit" onClick={() => startEdit(emp)}>
                      Edit
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(emp.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>

            ))}

            {!employees.length && (
              <tr>
                <td colSpan="4">No employees yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
