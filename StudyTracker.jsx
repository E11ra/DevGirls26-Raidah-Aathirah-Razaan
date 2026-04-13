import React, { useState, useEffect } from 'react';
import './StudyTrackerDesign.css';

const StudyTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem('study_data_v2');
    if (savedData) {
      setTasks(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('study_data_v2', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const newTask = {
      id: Date.now(),
      title,
      desc,
      deadline, // Format: YYYY-MM-DD
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks([newTask, ...tasks]);
    // Reset form
    setTitle('');
    setDesc('');
    setDeadline('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    if(window.confirm("Apakah kamu yakin ingin menghapus tugas ini?")) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.completed).length,
    dueToday: tasks.filter(t => t.deadline === today && !t.completed).length,
    overdue: tasks.filter(t => t.deadline < today && t.deadline !== "" && !t.completed).length
  };

  const getDeadlineStatus = (date, isCompleted) => {
    if (isCompleted || !date) return '';
    if (date < today) return 'overdue';
    if (date === today) return 'due-today';
    return '';
  };

  return (
    <div className="container">
      <header>
        <h1>Study Tracker 📚</h1>
        <p className="subtitle">Manajemen Tugas & Prioritas Kuliah</p>
      </header>

      {/* SECTION: RINGKASAN PRODUKTIVITAS */}
      <section className="stats" aria-label="Ringkasan Tugas">
        <div className="stat-item">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item warning">
          <span className="stat-value">{stats.dueToday}</span>
          <span className="stat-label">Hari Ini</span>
        </div>
        <div className="stat-item danger">
          <span className="stat-value">{stats.overdue}</span>
          <span className="stat-label">Terlambat</span>
        </div>
        <div className="stat-item success">
          <span className="stat-value">{stats.done}</span>
          <span className="stat-label">Selesai</span>
        </div>
      </section>

      {/* SECTION: INPUT TUGAS BARU */}
      <form onSubmit={addTask} className="task-form" aria-label="Tambah Tugas Baru">
        <div className="input-group">
          <label htmlFor="task-title">Judul Tugas</label>
          <input 
            id="task-title"
            type="text" 
            placeholder="Contoh: Resume Basis Data..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="task-desc">Keterangan (Opsional)</label>
          <textarea 
            id="task-desc"
            placeholder="Detail tugas atau catatan..." 
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="task-deadline">Tenggat Waktu (Deadline)</label>
          <input 
            id="task-deadline"
            type="date" 
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-add">
          Tambah ke Daftar
        </button>
      </form>

      {/* SECTION: DAFTAR TUGAS */}
      <main className="task-list-container">
        <ul className="task-list">
          {tasks.length === 0 ? (
            <p className="empty-state">Belum ada tugas 😊</p>
          ) : (
            tasks.map(task => (
              <li key={task.id} className={`task-item ${getDeadlineStatus(task.deadline, task.completed)}`}>
                <div className={`task-info ${task.completed ? 'completed' : ''}`}>
                  <h3>{task.title}</h3>
                  {task.desc && <p>{task.desc}</p>}
                  {task.deadline && (
                    <span className="deadline-badge" aria-label={`Deadline tanggal ${task.deadline}`}>
                      📅 {new Date(task.deadline).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                </div>
                <div className="actions">
                  <button 
                    className="btn-check" 
                    onClick={() => toggleTask(task.id)}
                    title={task.completed ? "Batal Selesai" : "Tandai Selesai"}
                  >
                    {task.completed ? '↩️' : '✅'}
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => deleteTask(task.id)}
                    title="Hapus Tugas"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Raidah Aathirah Razaan</p>
      </footer>
    </div>
  );
};

export default StudyTracker;