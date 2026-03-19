import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {Pencil, Trash2, Plus, FolderPlus, Bold, Italic, Underline, 
  List, ListOrdered, ImagePlus, Hash, Type, Code } from 'lucide-react';
import { useRef } from 'react';

const NoteTakingApp = () => {
  // Initialize state with localStorage data if available
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('noteCategories');
    return savedCategories ? JSON.parse(savedCategories) : ['General', 'Work', 'Personal', 'Study'];
  });

  const [selectedCategory, setSelectedCategory] = useState('General');
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [newNote, setNewNote] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const editorRef = useRef(null);

  // Save to localStorage whenever notes or categories change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('noteCategories', JSON.stringify(categories));
  }, [categories]);


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgTag = `<img src="${reader.result}" alt="Uploaded content" class="max-w-full h-auto my-2 rounded" />`;
        setNewNote(prev => prev + imgTag);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };


  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        content: newNote,
        category: selectedCategory,
        timestamp: new Date().toLocaleString(),
        lastUpdated: new Date().toLocaleString()
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const updateNote = (id, newContent) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, content: newContent, lastUpdated: new Date().toLocaleString() }
        : note
    ));
    setEditingNoteId(null);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Note Taking App</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Category Management */}
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New Category"
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={addCategory}
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
                >
                  <FolderPlus size={20} />
                  Add Category
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
              {/* rich text area */}
              <div className="border rounded-t p-2 bg-gray-50 flex flex-wrap gap-2">
              <button onClick={() => handleFormat('bold')} className="p-2 hover:bg-gray-200 rounded">
                <Bold size={20} />
              </button>
              <button onClick={() => handleFormat('italic')} className="p-2 hover:bg-gray-200 rounded">
                <Italic size={20} />
              </button>
              <button onClick={() => handleFormat('underline')} className="p-2 hover:bg-gray-200 rounded">
                <Underline size={20} />
              </button>
              <button onClick={() => handleFormat('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded">
                <List size={20} />
              </button>
              <button onClick={() => handleFormat('insertOrderedList')} className="p-2 hover:bg-gray-200 rounded">
                <ListOrdered size={20} />
              </button>
              <button onClick={() => handleFormat('formatBlock', 'h1')} className="p-2 hover:bg-gray-200 rounded">
                <Hash size={20} />
              </button>
              <button onClick={() => handleFormat('formatBlock', 'h2')} className="p-2 hover:bg-gray-200 rounded">
                <Type size={20} />
              </button>
              <button onClick={() => handleFormat('code')} className="p-2 hover:bg-gray-200 rounded">
                <Code size={20} />
              </button>
              <label className="p-2 hover:bg-gray-200 rounded cursor-pointer">
                <ImagePlus size={20} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            {/* Note Input */}
            <div className="flex flex-col gap-2 mb-6">
              <textarea
                id="richTextArea"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note... Use the toolbar above for formatting."
                className="w-full p-4 border rounded-b min-h-[300px] font-mono"
                style={{ resize: 'vertical' }}
              />
              <button
                onClick={addNote}
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600 w-full justify-center"
              >
                <Plus size={20} />
                Add Note
              </button>
            </div>

            {/* Notes List */}
            <div className="space-y-4">
              {notes
                .filter(note => note.category === selectedCategory)
                .map(note => (
                  <Card key={note.id} className="bg-white">
                    <CardContent className="p-4">
                      {editingNoteId === note.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={note.content}
                            onChange={(e) => {
                              const updatedNotes = notes.map(n => 
                                n.id === note.id ? { ...n, content: e.target.value } : n
                              );
                              setNotes(updatedNotes);
                            }}
                            className="flex-1 p-2 border rounded"
                            autoFocus
                          />
                          <button
                            onClick={() => updateNote(note.id, note.content)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-lg">{note.content}</p>
                            <div className="text-sm text-gray-500 mt-2">
                              <p>Created: {note.timestamp}</p>
                              <p>Last Updated: {note.lastUpdated}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => setEditingNoteId(note.id)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Pencil size={20} />
                            </button>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NoteTakingApp;