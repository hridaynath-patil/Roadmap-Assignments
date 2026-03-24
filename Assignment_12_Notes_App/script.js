// DOM Elements
const addNoteBtn = document.getElementById('add-note-btn');
const notesContainer = document.getElementById('notes-container');
const emptyState = document.getElementById('empty-state');

// State - load from LocalStorage if available
let notes = JSON.parse(localStorage.getItem('notesApp_data')) || [];

// Initialize App
function init() {
    renderNotes();
}

// Save to LocalStorage
function saveNotes() {
    localStorage.setItem('notesApp_data', JSON.stringify(notes));
    updateEmptyState();
}

// Update Empty State UI
function updateEmptyState() {
    if (notes.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

// Format Date helper
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Add Note Event
addNoteBtn.addEventListener('click', () => {
    const newNote = {
        id: Date.now().toString(),
        text: '',
        date: new Date().toISOString()
    };
    
    // Add to beginning of array
    notes.unshift(newNote);
    saveNotes();
    
    // Create the DOM element directly without re-rendering everything
    const noteEl = createNoteElement(newNote);
    if (notesContainer.firstChild) {
        notesContainer.insertBefore(noteEl, notesContainer.firstChild);
    } else {
        notesContainer.appendChild(noteEl);
    }
    
    // Focus the new textarea
    noteEl.querySelector('textarea').focus();
});

// Render all notes
function renderNotes() {
    notesContainer.innerHTML = '';
    
    notes.forEach(note => {
        const noteEl = createNoteElement(note);
        notesContainer.appendChild(noteEl);
    });
    
    updateEmptyState();
}

// Create Note DOM Element
function createNoteElement(note) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.id = `note-${note.id}`;
    
    noteDiv.innerHTML = `
        <div class="note-header">
            <span class="note-date">${formatDate(note.date)}</span>
            <button class="delete-btn" aria-label="Delete Note">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
        <div class="note-body">
            <textarea class="note-textarea" placeholder="Start typing...">${escapeHtml(note.text)}</textarea>
        </div>
    `;
    
    // Event Listeners for this specific note
    const textarea = noteDiv.querySelector('textarea');
    const deleteBtn = noteDiv.querySelector('.delete-btn');
    
    // Update text on input (using event delegation for better performance on many notes)
    textarea.addEventListener('input', (e) => {
        // Update the state array
        const noteIndex = notes.findIndex(n => n.id === note.id);
        if (noteIndex !== -1) {
            notes[noteIndex].text = e.target.value;
            // Update timestamp
            notes[noteIndex].date = new Date().toISOString();
            noteDiv.querySelector('.note-date').textContent = formatDate(notes[noteIndex].date);
            saveNotes();
        }
    });
    
    // Delete Note
    deleteBtn.addEventListener('click', () => {
        // Add a tiny animation before removing
        noteDiv.style.transform = 'scale(0.9)';
        noteDiv.style.opacity = '0';
        
        setTimeout(() => {
            notes = notes.filter(n => n.id !== note.id);
            saveNotes();
            noteDiv.remove();
            updateEmptyState();
        }, 200);
    });
    
    return noteDiv;
}

// Security helper to prevent XSS when loading from storage (since we insert as value, it's safer, but good practice)
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Start application
init();
