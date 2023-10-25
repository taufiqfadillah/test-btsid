import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://94.74.86.174:8080/api';
const AUTH_TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJyb2xlcyI6W119.i2OVQdxr08dmIqwP7cWOJk5Ye4fySFUqofl-w6FKbm4EwXTStfm0u-sGhDvDVUqNG8Cc7STtUJlawVAP057Jlg';

const ChecklistApp = () => {
  const [checklists, setChecklists] = useState([]);
  const [newChecklistName, setNewChecklistName] = useState('');

  const fetchChecklists = () => {
    axios
      .get(`${BASE_URL}/checklist`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setChecklists(response.data);
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

  useEffect(() => {
    fetchChecklists();
  }, []);

  return (
    <div>
      <h1>Checklist App</h1>
      <div>
        <h2>Daftar Checklist</h2>
        <ul>
          {checklists.map((checklist) => (
            <li key={checklist.id}>{checklist.name}</li>
          ))}
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
