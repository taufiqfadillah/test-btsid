import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const BASE_URL = 'http://94.74.86.174:8080/api';

const ChecklistApp = () => {
  const [checklists, setChecklists] = useState([]);
  const [newChecklistName, setNewChecklistName] = useState('');
  const [editChecklistId, setEditChecklistId] = useState(null);
  const [editChecklistName, setEditChecklistName] = useState('');
  const { authToken } = useContext(AuthContext);

  const fetchChecklists = () => {
    axios
      .get(`${BASE_URL}/checklist`, {
        headers: { Authorization: `Bearer ${authToken}` },
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
          headers: { Authorization: `Bearer ${authToken}` },
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
        headers: { Authorization: `Bearer ${authToken}` },
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
          headers: { Authorization: `Bearer ${authToken}` },
        }
      )
      .then(() => {
        fetchChecklists();
        cancelEditing();
      })
      .catch((error) => {
        if (error.message === 'Network Error') {
          console.error('Terdapat masalah jaringan. Silakan periksa koneksi Anda.');
        } else {
          console.error(`Error updating checklist with id ${editChecklistId}`, error);
        }
      });
  };

  useEffect(() => {
    const fetchChecklists = () => {
      axios
        .get(`${BASE_URL}/checklist`, {
          headers: { Authorization: `Bearer ${authToken}` },
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

    fetchChecklists();
  }, [authToken]);

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
                <i onClick={updateChecklist}>💾</i>
                <i onClick={cancelEditing}>❌</i>
              </li>
            ) : (
              <li key={checklist.id} style={{ border: '1px solid black', margin: '10px 0', padding: '10px' }}>
                {checklist.name}
                <i style={{ marginLeft: '10px' }} onClick={() => startEditing(checklist.id, checklist.name)}>
                  ✏️
                </i>
                <i onClick={() => deleteChecklist(checklist.id)}>🗑️</i>
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
