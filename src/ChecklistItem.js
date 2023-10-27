import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const BASE_URL = 'http://94.74.86.174:8080/api';

const ChecklistItem = () => {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [lastChecklistId, setLastChecklistId] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState(false);
  const { authToken } = useContext(AuthContext);

  const fetchItems = useCallback(async () => {
    let id = 1;
    const allItems = [];
    while (true) {
      try {
        const response = await axios.get(`${BASE_URL}/checklist/${id}/item`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (response.data.data.length === 0) {
          break;
        }
        allItems.push(...response.data.data);
        id++;
      } catch (error) {
        console.error('Error fetching items', error);
        break;
      }
    }
    setItems(allItems);
    setLastChecklistId(id - 1);
  }, [authToken]);

  const createChecklistItem = useCallback(async () => {
    try {
      const newItem = {
        itemName: newItemName,
      };
      await axios.post(`${BASE_URL}/checklist/${lastChecklistId}/item`, newItem, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setNewItemName('');
      fetchItems();
    } catch (error) {
      console.error('Error creating item', error);
    }
  }, [authToken, fetchItems, lastChecklistId, newItemName]);

  const deleteChecklistItem = useCallback(
    async (itemId) => {
      try {
        await axios.delete(`${BASE_URL}/checklist/${lastChecklistId}/item/${itemId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        fetchItems();
      } catch (error) {
        console.error('Error deleting item', error);
      }
    },
    [authToken, fetchItems, lastChecklistId]
  );

  const detailChecklistItem = useCallback(
    (item) => {
      if (selectedItem && selectedItem.id === item.id) {
        setSelectedItem(null);
      } else {
        setSelectedItem(item);
      }
    },
    [selectedItem]
  );

  const editChecklistItem = useCallback(
    async (itemId) => {
      try {
        await axios.put(
          `${BASE_URL}/checklist/${lastChecklistId}/item/rename/${itemId}`,
          { itemName: editName },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        await axios.put(
          `${BASE_URL}/checklist/${lastChecklistId}/item/${itemId}`,
          { itemCompletionStatus: editStatus },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        fetchItems();
        setEditMode(false);
      } catch (error) {
        console.error('Error editing item', error);
      }
    },
    [authToken, fetchItems, lastChecklistId, editName, editStatus]
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
        <h2>Daftar Checklist Items</h2>
        <ul style={{ listStyleType: 'none', padding: 0, width: '500px' }}>
          {Array.isArray(items) &&
            items.map((item) => (
              <React.Fragment key={item.id}>
                <li style={{ border: '1px solid black', margin: '10px 0', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  {!editMode || (selectedItem && selectedItem.id !== item.id) ? (
                    <>
                      <div>{item.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '90px', marginRight: '10px' }}>
                        <i onClick={() => detailChecklistItem(item)} style={{ border: '1px solid black', padding: '5px' }}>
                          👁️
                        </i>
                        <i
                          onClick={() => {
                            setEditMode(true);
                            setSelectedItem(item);
                            setEditName(item.name);
                            setEditStatus(item.itemCompletionStatus);
                          }}
                          style={{ border: '1px solid black', padding: '5px' }}>
                          ✏️
                        </i>
                        <i onClick={() => deleteChecklistItem(item.id)} style={{ border: '1px solid black', padding: '5px' }}>
                          🗑️
                        </i>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
                      <select value={editStatus} onChange={(e) => setEditStatus(e.target.value === 'true')} style={{ width: '100%', marginBottom: '10px' }}>
                        <option value={true}>Completed</option>
                        <option value={false}>Not Completed</option>
                      </select>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '60px' }}>
                        <i
                          onClick={() => {
                            setEditMode(false);
                            setSelectedItem(null);
                          }}
                          style={{ border: '1px solid black', padding: '5px' }}>
                          ❌
                        </i>
                        <i
                          onClick={() => {
                            editChecklistItem(selectedItem.id);
                            setSelectedItem(null);
                          }}
                          style={{ border: '1px solid black', padding: '5px' }}>
                          💾
                        </i>
                      </div>
                    </div>
                  )}
                </li>
                {selectedItem && selectedItem.id === item.id && !editMode && (
                  <li style={{ border: '1px solid black', borderTopWidth: 0, margin: '0px 0', padding: '10px' }}>
                    <p>ID: {selectedItem.id}</p>
                    <p>Completion Status: {selectedItem.itemCompletionStatus ? 'Completed' : 'Not Completed'}</p>
                  </li>
                )}
              </React.Fragment>
            ))}
        </ul>
      </div>
      <div>
        <h2>Tambah Checklist Item Baru</h2>
        <input type="text" placeholder="Nama Checklist Item Baru" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
        <button style={{ marginTop: '10px' }} onClick={createChecklistItem}>
          Tambah
        </button>
      </div>
    </div>
  );
};

export default ChecklistItem;
