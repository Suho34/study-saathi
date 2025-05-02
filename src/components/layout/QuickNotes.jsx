import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { Trash2, Plus, Edit, Check, X } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";

export default function QuickNotes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchNotes(currentUser.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchNotes = async (userId) => {
    try {
      const q = query(
        collection(db, "notes"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const notesList = [];
      querySnapshot.forEach((doc) => {
        notesList.push({ id: doc.id, ...doc.data() });
      });
      setNotes(notesList);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Failed to load notes");
    }
  };

  const handleAddNote = async () => {
    if (!newNote || !newNote.trim()) {
      setError("Note cannot be empty");
      textareaRef.current.focus();
      return;
    }

    if (!user) {
      setError("You must be logged in to add notes");
      return;
    }

    try {
      const noteData = {
        content: newNote.trim(),
        createdAt: new Date(),
        userId: user.uid,
      };

      const docRef = await addDoc(collection(db, "notes"), noteData);
      setNotes([{ id: docRef.id, ...noteData }, ...notes]);
      setNewNote("");
      setError(null);
      textareaRef.current.focus();
    } catch (error) {
      console.error("Error adding note:", error);
      setError("Failed to add note");
    }
  };

  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditContent("");
  };

  const saveEdit = async (noteId) => {
    if (!editContent.trim()) {
      setError("Note cannot be empty");
      return;
    }

    try {
      await updateDoc(doc(db, "notes", noteId), {
        content: editContent.trim(),
        updatedAt: new Date(),
      });

      setNotes(
        notes.map((note) =>
          note.id === noteId
            ? { ...note, content: editContent.trim(), updatedAt: new Date() }
            : note
        )
      );
      setEditingNoteId(null);
      setEditContent("");
      setError(null);
    } catch (error) {
      console.error("Error updating note:", error);
      setError("Failed to update note");
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await deleteDoc(doc(db, "notes", noteId));
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-slate-800 mb-6"
      >
        Quick Notes
      </motion.h2>

      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <textarea
            ref={textareaRef}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddNote();
              }
            }}
            placeholder="Write your note here..."
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200 resize-none"
            rows="3"
          />
          <div className="flex justify-between items-center mt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddNote}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Note
            </motion.button>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-slate-500">
              No notes yet. Add your first note above!
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
                className={`p-4 rounded-xl flex flex-col ${
                  editingNoteId === note.id
                    ? "bg-indigo-50 border border-indigo-200"
                    : "bg-slate-50 hover:bg-slate-100"
                } transition-colors duration-200`}
              >
                {editingNoteId === note.id ? (
                  <>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      rows="3"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => saveEdit(note.id)}
                        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-slate-700 whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        {format(
                          note.createdAt?.toDate
                            ? note.createdAt.toDate()
                            : new Date(),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                        {note.updatedAt && " (edited)"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(note)}
                        className="p-1 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                        aria-label="Edit note"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
