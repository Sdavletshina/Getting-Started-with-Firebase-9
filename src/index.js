import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBv-kbB2BLP3-icP3gmPgyKRhtzXEXd-HU',
  authDomain: 'ninja-forestore-tut.firebaseapp.com',
  projectId: 'ninja-forestore-tut',
  storageBucket: 'ninja-forestore-tut.appspot.com',
  messagingSenderId: '32404277971',
  appId: '1:32404277971:web:c538712e3b0a06ad8e2226',
};

//init firebase app
initializeApp(firebaseConfig);

//init services
const db = getFirestore();
const auth = getAuth();

//collection ref
const colRef = collection(db, 'books');

//queries
const q = query(
  colRef,
  where('author', '==', 'patrick rothuss'),
  orderBy('createdAt')
);

//get realtime collection data
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log('books', books);
});

// adding docs
const addBooksForm = document.querySelector('.add');
addBooksForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addDoc(colRef, {
    title: addBooksForm.title.value,
    author: addBooksForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBooksForm.reset();
  });
});

// deleting docs
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const docRef = doc(db, 'books', deleteBookForm.id.value);

  deleteDoc(docRef).then(() => deleteBookForm.reset());
});

// get doc

const docRef = doc(db, 'books', 'nLXLcavk5QwXcYsy2Jb4');

// getDoc(docRef).then((doc) => {
//   console.log(doc.data(), doc.id);
// });

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log('doc has changed', doc.data(), doc.id);
});

const updateBookForm = document.querySelector('.update');

updateBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const docRef = doc(db, 'books', updateBookForm.id.value);
  updateDoc(docRef, {
    title: 'updated!',
  }).then(() => updateBookForm.reset());
});

//signing user up
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signupForm.email.value;
  const password = signupForm.password.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user created:', cred.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log('error', err);
    });
});

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user logged in:', cred.user);
      loginForm.reset();
    })
    .catch((err) => {
      console.log('error', err);
    });
});

const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      console.log('logged out');
    })
    .catch((err) => {
      console.log('error', err);
    });
});

const unsubAuth = onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('user logged in:', user);
  } else {
    console.log('user logged out');
  }
});

const unsubButton = document.querySelector('.unsubscribe');
unsubButton.addEventListener('click', (e) => {
  console.log('unsubscribed');
  unsubCol();
  unsubDoc();
  unsubAuth();
});
