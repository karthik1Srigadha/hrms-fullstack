import { useEffect, useState } from "react";
import api from "../services/api";
import "../pages/Styles/Auth.css";


export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
  });

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const isEditing = !!form.id;

  async function loadTeams() {
    try {
      const res = await api.get("/teams");
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to load teams:", err);
    }
  }

  async function loadEmployees() {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to load employees:", err);
    }
  }

  useEffect(() => {
    loadTeams();
    loadEmployees();
  }, []);

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (isEditing) {
        await api.put(`/teams/${form.id}`, form);
      } else {
        await api.post("/teams", form);
      }

      setForm({ id: null, name: "", description: "" });
      loadTeams();
    } catch (err) {
      console.error("Team save error:", err);
    }
  }

  function startEdit(team) {
    setForm({
      id: team.id,
      name: team.name,
      description: team.description,
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete team?")) return;

    try {
      await api.delete(`/teams/${id}`);
      loadTeams();
    } catch (err) {
      console.error("Delete team error:", err);
    }
  }

  function openAssign(team) {
    setSelectedTeam(team);
    setSelectedEmployeeIds(team.employees.map((e) => e.id));
  }

  function toggleEmployee(id) {
    setSelectedEmployeeIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  }

  async function saveAssignments() {
    try {
      await api.post(`/teams/${selectedTeam.id}/assign`, {
        employeeIds: selectedEmployeeIds,
      });

      setSelectedTeam(null);
      loadTeams();
    } catch (err) {
      console.error("Assign error:", err);
    }
  }

  return (
    <div className="page">
      <h2>Teams</h2>

      <section className="form-section">
        <h3>{isEditing ? "Edit Team" : "Add Team"}</h3>

        <form className="entity-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Team Name"
            value={form.name}
            onChange={handleFormChange}
            required
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleFormChange}
          />

          <button type="submit">{isEditing ? "Update" : "Create"}</button>
        </form>
      </section>

      <section>
        <h3>Team List</h3>

        <table className="list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Members</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.memberCount}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn edit" onClick={() => startEdit(t)}>
                      Edit
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(t.id)}>
                      Delete
                    </button>
                    <button className="action-btn assign" onClick={() => openAssign(t)}>
                      Assign
                    </button>
                  </div>
                </td>
              </tr>

            ))}

            {!teams.length && (
              <tr>
                <td colSpan="3">No teams yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {selectedTeam && (
        <div className="modal-backdrop">
   <div className="modal enhanced-modal">
    <h3 className="modal-title">Assign Employees to {selectedTeam.name}</h3>

    <div className="modal-body">
      {employees.map((emp) => (
        <label key={emp.id} className="checkbox-item">
          <input
            type="checkbox"
            checked={selectedEmployeeIds.includes(emp.id)}
            onChange={() => toggleEmployee(emp.id)}
          />
          <span>{emp.firstName} {emp.lastName}</span>
        </label>
      ))}
    </div>

    <div className="modal-actions">
      <button className="btn-primary" onClick={saveAssignments}>Save</button>
      <button className="btn-secondary" onClick={() => setSelectedTeam(null)}>Close</button>
    </div>
  </div>
</div>

      )}
    </div>
  );
}
