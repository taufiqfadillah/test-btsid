import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const BASE_URL = 'http://94.74.86.174:8080/api';

const ChecklistApp = () => {
  const [checklists, setChecklists] = useState([]);
  const [newChecklistName, setNewChecklistName] = useState('');
  const { authToken } = useContext(AuthContext);

  const fetchChecklists = () => {
    axios
      .get(`${BASE_URL}/checklist`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          const updatedChecklists = response.data.data.map((checklist) => ({
            ...checklist,
            name: checklist.name,
          }));
          setChecklists(updatedChecklists);
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

  useEffect(() => {
    const fetchChecklists = () => {
      axios
        .get(`${BASE_URL}/checklist`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          if (Array.isArray(response.data.data)) {
            const updatedChecklists = response.data.data.map((checklist) => ({
              ...checklist,
              name: checklist.name,
            }));
            setChecklists(updatedChecklists);
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
      <div>
        <h2>Daftar Checklist</h2>
        <ul style={{ listStyleType: 'none', padding: 0, width: '500px' }}>
          {checklists.map((checklist) => (
            <li key={checklist.id} style={{ border: '1px solid black', margin: '10px 0', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <div>{`${checklist.name}`}</div>
              <div>
                <i onClick={() => deleteChecklist(checklist.id)} style={{ border: '1px solid black', padding: '5px' }}>
                  🗑️
                </i>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Tambah Checklist Baru</h2>
        <input type="text" placeholder="Nama Checklist Baru" value={newChecklistName} onChange={(e) => setNewChecklistName(e.target.value)} />
        <button style={{ marginTop: '10px' }} onClick={createChecklist}>
          Tambah
        </button>
      </div>
    </div>
  );
};

export default ChecklistApp;
