import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { app } from '../../firebaseConfig';
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const db = getFirestore(app)
const auth = getAuth();

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  constructor(public router: Router) { }

  async loginFirebase(user:string, password:string) {
    let email = ''
    const q = query(collection(db, "Usuarios"), where("usuario", "==", user))
    const querySnapshot = await getDocs(q)  

    querySnapshot.forEach((doc) => {
      email = doc.data().email
    })

    if(email != '') {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        localStorage.setItem('user', user)
        this.router.navigateByUrl('/home')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log('Senha incorreta')
      })
    } else {
      console.log('Usuário não existe')
    }
  }

  createUser(email:string, password:string, login:string) {
    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      login = login.toLowerCase()
      const docRef = await addDoc(collection(db, 'Usuarios'), {
        usuario: login,
        email: email,
        id: auth.currentUser.uid
      })
      console.log('Sucesso!')
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
    })
  }
}
