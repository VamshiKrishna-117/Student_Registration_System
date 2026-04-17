// script.js — Student Registration System
// This file handles all the functionality:
// adding, editing, deleting students, saving to localStorage, and validation.

// -----------------------------------------------
// LOAD & SAVE — Reading and writing to localStorage
// -----------------------------------------------

// Get the students list from localStorage
// If nothing is saved yet, return an empty array
function loadStudents() {
  var data = localStorage.getItem('students');
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
}

// Save the students list to localStorage
function saveStudents(students) {
  localStorage.setItem('students', JSON.stringify(students));
}

// -----------------------------------------------
// VALIDATION — Check each input field
// -----------------------------------------------

// Validate Student Name: only letters and spaces allowed
function validateName(name) {
  var nameError = document.getElementById('nameError');
  var nameInput = document.getElementById('studentName');

  if (name === '') {
    nameError.textContent = 'This field is required.';
    nameInput.classList.add('invalid');
    return false;
  }

  // Check if name has any character that is NOT a letter or space
  var namePattern = /^[A-Za-z\s]+$/;
  if (!namePattern.test(name)) {
    nameError.textContent = 'Name must contain letters only.';
    nameInput.classList.add('invalid');
    return false;
  }

  // Valid — clear any previous error
  nameError.textContent = '';
  nameInput.classList.remove('invalid');
  return true;
}

// Validate Student ID: numbers only
function validateId(id) {
  var idError = document.getElementById('idError');
  var idInput = document.getElementById('studentId');

  if (id === '') {
    idError.textContent = 'This field is required.';
    idInput.classList.add('invalid');
    return false;
  }

  var idPattern = /^\d+$/;
  if (!idPattern.test(id)) {
    idError.textContent = 'Student ID must be a number.';
    idInput.classList.add('invalid');
    return false;
  }

  idError.textContent = '';
  idInput.classList.remove('invalid');
  return true;
}

// Validate Email: must look like a valid email address
function validateEmail(email) {
  var emailError = document.getElementById('emailError');
  var emailInput = document.getElementById('emailId');

  if (email === '') {
    emailError.textContent = 'This field is required.';
    emailInput.classList.add('invalid');
    return false;
  }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    emailError.textContent = 'Enter a valid email address.';
    emailInput.classList.add('invalid');
    return false;
  }

  emailError.textContent = '';
  emailInput.classList.remove('invalid');
  return true;
}

// Validate Contact: numbers only, at least 10 digits
function validateContact(contact) {
  var contactError = document.getElementById('contactError');
  var contactInput = document.getElementById('contactNo');

  if (contact === '') {
    contactError.textContent = 'This field is required.';
    contactInput.classList.add('invalid');
    return false;
  }

  var contactPattern = /^\d{10,}$/;
  if (!contactPattern.test(contact)) {
    contactError.textContent = 'Contact number must be at least 10 digits (numbers only).';
    contactInput.classList.add('invalid');
    return false;
  }

  contactError.textContent = '';
  contactInput.classList.remove('invalid');
  return true;
}

// -----------------------------------------------
// RENDER — Show all students in the table
// -----------------------------------------------

function renderTable() {
  var tableBody = document.getElementById('tableBody');
  var emptyMsg = document.getElementById('emptyMsg');
  var tableWrapper = document.getElementById('tableWrapper');

  // Safety check — tableBody might not exist on some pages
  if (!tableBody) return;

  var students = loadStudents();

  // Clear existing rows before re-rendering
  tableBody.innerHTML = '';

  // If no students, show the empty message and remove scrollbar
  if (students.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (tableWrapper) {
      tableWrapper.style.maxHeight = '';
      tableWrapper.style.overflowY = '';
    }
    return;
  }

  // There are students — hide the empty message
  if (emptyMsg) emptyMsg.style.display = 'none';

  // Loop through each student and create a table row
  for (var i = 0; i < students.length; i++) {
    var student = students[i];

    var tr = document.createElement('tr');

    // Use a helper to escape HTML so user input doesn't break the page
    tr.innerHTML =
      '<td>' + escapeHTML(student.name) + '</td>' +
      '<td>' + escapeHTML(student.id) + '</td>' +
      '<td>' + escapeHTML(student.email) + '</td>' +
      '<td>' + escapeHTML(student.contact) + '</td>' +
      '<td>' +
        '<button class="btn-edit" onclick="editStudent(' + i + ')">Edit</button>' +
        '<button class="btn-delete" onclick="deleteStudent(' + i + ')">Delete</button>' +
      '</td>';

    tableBody.appendChild(tr);
  }

  // Dynamically add a vertical scrollbar when rows overflow (Task 6)
  if (tableWrapper) {
    tableWrapper.style.maxHeight = '420px';
    tableWrapper.style.overflowY = 'auto';
    tableWrapper.style.overflowX = 'auto';
  }
}

// -----------------------------------------------
// ADD — Register a new student
// -----------------------------------------------

function addStudent() {
  var nameInput    = document.getElementById('studentName');
  var idInput      = document.getElementById('studentId');
  var emailInput   = document.getElementById('emailId');
  var contactInput = document.getElementById('contactNo');

  // If the form doesn't exist (e.g. on records.html), do nothing
  if (!nameInput) return;

  var name    = nameInput.value.trim();
  var id      = idInput.value.trim();
  var email   = emailInput.value.trim();
  var contact = contactInput.value.trim();

  // Validate all fields — run all four so all errors show at once
  var nameOK    = validateName(name);
  var idOK      = validateId(id);
  var emailOK   = validateEmail(email);
  var contactOK = validateContact(contact);

  // Stop here if any field is invalid
  if (!nameOK || !idOK || !emailOK || !contactOK) return;

  // Build the new student object
  var newStudent = {
    name: name,
    id: id,
    email: email,
    contact: contact
  };

  // Add to the list and save
  var students = loadStudents();
  students.push(newStudent);
  saveStudents(students);

  // Clear the form fields after successful add
  nameInput.value    = '';
  idInput.value      = '';
  emailInput.value   = '';
  contactInput.value = '';

  // Refresh the table
  renderTable();
}

// -----------------------------------------------
// EDIT — Load a student's data into the form
// -----------------------------------------------

function editStudent(index) {
  var students = loadStudents();
  var student  = students[index];

  // If on records.html (no form), redirect to index.html with the index stored
  if (!document.getElementById('studentName')) {
    localStorage.setItem('editIndex', index);
    window.location.href = 'index.html';
    return;
  }

  // Fill the form with the student's current data
  document.getElementById('studentName').value = student.name;
  document.getElementById('studentId').value   = student.id;
  document.getElementById('emailId').value      = student.email;
  document.getElementById('contactNo').value    = student.contact;

  // Change the "Add Student" button to "Update Student"
  var addBtn = document.getElementById('addBtn');
  if (addBtn) {
    addBtn.textContent = 'Update Student';
    addBtn.onclick = function() {
      updateStudent(index);
    };
  }

  // Scroll smoothly up to the form
  document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Save the updated student data
function updateStudent(index) {
  var nameInput    = document.getElementById('studentName');
  var idInput      = document.getElementById('studentId');
  var emailInput   = document.getElementById('emailId');
  var contactInput = document.getElementById('contactNo');

  var name    = nameInput.value.trim();
  var id      = idInput.value.trim();
  var email   = emailInput.value.trim();
  var contact = contactInput.value.trim();

  // Validate before saving
  var nameOK    = validateName(name);
  var idOK      = validateId(id);
  var emailOK   = validateEmail(email);
  var contactOK = validateContact(contact);

  if (!nameOK || !idOK || !emailOK || !contactOK) return;

  // Update the student at the given index
  var students = loadStudents();
  students[index] = {
    name: name,
    id: id,
    email: email,
    contact: contact
  };
  saveStudents(students);

  // Clear the form
  nameInput.value    = '';
  idInput.value      = '';
  emailInput.value   = '';
  contactInput.value = '';

  // Restore the "Add Student" button
  var addBtn = document.getElementById('addBtn');
  if (addBtn) {
    addBtn.textContent = 'Add Student';
    addBtn.onclick = addStudent;
  }

  // Refresh the table
  renderTable();
}

// -----------------------------------------------
// DELETE — Remove a student from the list
// -----------------------------------------------

function deleteStudent(index) {
  // Ask the user to confirm before deleting
  var confirmed = confirm('Are you sure you want to delete this student record?');
  if (!confirmed) return;

  var students = loadStudents();
  students.splice(index, 1); // remove 1 item at the given index
  saveStudents(students);

  renderTable();
}

// -----------------------------------------------
// UTILITY — Escape special HTML characters
// This prevents user input from breaking the page layout
// -----------------------------------------------

function escapeHTML(str) {
  var text = String(str);
  text = text.replace(/&/g, '&amp;');
  text = text.replace(/</g, '&lt;');
  text = text.replace(/>/g, '&gt;');
  text = text.replace(/"/g, '&quot;');
  text = text.replace(/'/g, '&#39;');
  return text;
}

// -----------------------------------------------
// INIT — Run when the page first loads
// -----------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  // Show any existing students in the table
  renderTable();

  // If we came from records.html to edit a student, pre-fill the form
  var editIndex = localStorage.getItem('editIndex');
  if (editIndex !== null && document.getElementById('studentName')) {
    localStorage.removeItem('editIndex');
    editStudent(parseInt(editIndex));
  }
});
