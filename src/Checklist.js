import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://94.74.86.174:8080/api';
const AUTH_TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJyb2xlcyI6W119.i2OVQdxr08dmIqwP7cWOJk5Ye4fySFUqofl-w6FKbm4EwXTStfm0u-sGhDvDVUqNG8Cc7STtUJlawVAP057Jlg';

const ChecklistApp = () => {
  const [checklists, setChecklists] = useState([]);
  const [newChecklistName, setNewChecklistName] = useState('');
  const [editChecklistId, setEditChecklistId] = useState(null);
  const [editChecklistName, setEditChecklistName] = useState('');

  const fetchChecklists = () => {
    axios
      .get(`${BASE_URL}/checklist`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      })
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setChecklists(response.data.data);
        } else {
          console.error('Invalid response data. Expected an array:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching checklists', error);
      });
  };

  const createChecklist = () => {
    axios
      .post(
        `${BASE_URL}/checklist`,
        { name: newChecklistName },
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        }
      )
      .then(() => {
        fetchChecklists();
        setNewChecklistName('');
      })
      .catch((error) => {
        console.error('Error creating checklist', error);
      });
  };

  const deleteChecklist = (id) => {
    axios
      .delete(`${BASE_URL}/checklist/${id}`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      })
      .then(() => {
        fetchChecklists();
      })
      .catch((error) => {
        console.error(`Error deleting checklist with id ${id}`, error);
      });
  };

  const startEditing = (id, name) => {
    setEditChecklistId(id);
    setEditChecklistName(name);
  };

  const cancelEditing = () => {
    setEditChecklistId(null);
    setEditChecklistName('');
  };

  const updateChecklist = (id) => {
    axios
      .put(
        `${BASE_URL}/checklist/${editChecklistId}/item/rename/${id}`,
        { itemName: editChecklistName },
        {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        }
      )
      .then(() => {
        fetchChecklists();
        cancelEditing();
      })
      .catch((error) => {
        console.error(`Error updating checklist with id ${editChecklistId}`, error);
      });
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Checklist App</h1>
      <div>
        <h2>Daftar Checklist</h2>
        <ul style={{ listStyleType: 'none', padding: 0, width: '500px' }}>
          {checklists.map((checklist) =>
            editChecklistId === checklist.id ? (
              <li key={checklist.id} style={{ border: '1px solid black', margin: '10px 0', padding: '10px' }}>
                <input type="text" value={editChecklistName} onChange={(e) => setEditChecklistName(e.target.value)} />
                <button onClick={updateChecklist}>💾</button>
                <button onClick={cancelEditing}>❌</button>
              </li>
            ) : (
              <li key={checklist.id} style={{ border: '1px solid black', margin: '10px 0', padding: '10px' }}>
                {checklist.name}
                <button style={{ marginLeft: '10px' }} onClick={() => startEditing(checklist.id, checklist.name)}>
                  ✏️
                </button>
                <button onClick={() => deleteChecklist(checklist.id)}>🗑️</button>
              </li>
            )
          )}
        </ul>
      </div>
      <div>
        <h2>Tambah Checklist Baru</h2>
        <input type="text" placeholder="Nama Checklist Baru" value={newChecklistName} onChange={(e) => setNewChecklistName(e.target.value)} />
        <button onClick={createChecklist}>Tambah</button>
      </div>
    </div>
  );
};

export default ChecklistApp;
